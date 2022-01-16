mod app;
mod draw_functions;
mod events;
mod util;

use crate::data::Data;
use crate::weather_requests;
use app::App;
use events::{Event, Events};
use futures::future;
use std::{error::Error, io, vec::Vec};
use termion::{raw::IntoRawMode, screen::AlternateScreen};
use tui::{backend::TermionBackend, Terminal};

pub async fn start(data: Data) -> Result<(), Box<dyn Error>> {
    let mut locations = data.get_locations().unwrap();
    let mut weather_futures = Vec::new();
    for location in locations.iter() {
        weather_futures.push(weather_requests::get_hourly_for_lat_lon(
            location.coord.y,
            location.coord.x,
        ))
    }
    for (weather, location) in future::join_all(weather_futures)
        .await
        .iter()
        .zip(locations.iter_mut())
    {
        location.weather = match weather.as_ref() {
            Ok(weather) => Some(weather.clone()),
            Err(_) => None,
        };
    }

    let events = Events::new();

    let stdout = io::stdout().into_raw_mode()?;
    let stdout = AlternateScreen::from(stdout);
    let backend = TermionBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;
    terminal.hide_cursor()?;
    let mut app = App::new(locations, data);

    loop {
        terminal.draw(|frame| draw_functions::draw(frame, &mut app))?;
        match events.next()? {
            Event::Input(key) => {
                app.on_key(key).await;
            }
            Event::Tick => app.on_tick(),
        }

        if app.should_quit {
            break;
        }
    }
    Ok(())
}
