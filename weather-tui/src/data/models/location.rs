use crate::data::models::weather::WeatherRoot;
use crate::SECRETS;
use geocoding::{Coordinate, Forward, Opencage, Point};

#[derive(Debug, Clone)]
pub struct Location {
    pub name: String,
    pub coord: Coordinate<f64>,
    pub weather: Option<WeatherRoot>,
    pub selected: bool,
}

impl Location {
    pub fn new(name: String) -> Option<Self> {
        let res = Self::get_geocoords(&name);
        if let Some(coord) = res {
            Some(Self {
                coord,
                name,
                weather: None,
                selected: false,
            })
        } else {
            None
        }
    }

    pub fn from(name: String, coord: Coordinate<f64>, selected: bool) -> Self {
        Self {
            name,
            coord,
            weather: None,
            selected,
        }
    }

    fn get_geocoords(name: &str) -> Option<Coordinate<f64>> {
        let oc = Opencage::new(SECRETS.oc_key.clone());
        let mut res: Vec<Point<f64>> = oc.forward(name).unwrap();
        if !res.is_empty() {
            Some(res.remove(0).0)
        } else {
            None
        }
    }
}
