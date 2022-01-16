use std::path::PathBuf;
use geocoding::Coordinate;
use rusqlite::{Connection, Result, NO_PARAMS};

pub mod models;
use models::location::Location;

pub struct Data {
    conn: Connection,
}

impl Data {
    pub fn new() -> Result<Data> {
        let mut path = std::env::current_exe().unwrap();
        path.pop();
        let path: PathBuf = path.join(".weather_locations.db");
        let conn = Connection::open(path)?;

        conn.execute(
            "create table if not exists locations (
                id integer primary key,
                location text not null unique,
                lat decimal(8,6) not null,
                lon decimal(9,6) not null,
                selected integer DEFAULT 0
            )",
            NO_PARAMS,
        )?;

        Ok(Data { conn })
    }

    pub fn insert_location(&self, loc: &Location) -> Result<usize> {
        self.conn.execute(
            "INSERT INTO locations (location, lat, lon) values (?1, ?2, ?3)",
            &[
                &loc.name,
                &loc.coord.y.to_string(),
                &loc.coord.x.to_string(),
            ],
        )
    }

    pub fn get_locations(&self) -> Result<Vec<Location>> {
        let mut stmt = self.conn.prepare(
            "
            SELECT location, lat, lon, selected
            FROM locations
            ORDER BY location",
        )?;

        let mut locations = Vec::<Location>::new();
        let location_rows = stmt.query_map(NO_PARAMS, |row| {
            let select: i64 = row.get(3);
            Location::from(
                row.get(0),
                Coordinate {
                    x: row.get(2),
                    y: row.get(1),
                },
                select == 1,
            )
        })?;

        for location in location_rows {
            if let Ok(loc) = location {
                locations.push(loc);
            }
        }

        Ok(locations)
    }

    pub fn delete_location(&self, loc: &Location) -> Result<usize> {
        self.conn
            .execute("DELETE FROM locations where location = (?1)", &[&loc.name])
    }

    pub fn select_location(&self, loc: &Location) -> Result<usize> {
        self.conn
            .execute("UPDATE locations SET selected = 0 WHERE true", NO_PARAMS)?;
        self.conn.execute(
            "UPDATE locations SET selected = 1 WHERE location = (?1)",
            &[&loc.name],
        )
    }

    pub fn get_selected_location(&self) -> Result<Location> {
        let mut stmt = self.conn.prepare(
            "
            SELECT location, lat, lon, selected
            FROM locations
            WHERE selected = 1",
        )?;
        let location_rows = stmt.query_map(NO_PARAMS, |row| {
            Location::from(
                row.get(0),
                Coordinate {
                    x: row.get(2),
                    y: row.get(1),
                },
                true,
            )
        })?;

        let mut locations: Vec<Result<Location>> = location_rows.collect();
        locations.remove(0)
    }
}
