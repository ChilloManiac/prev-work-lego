use crate::data::models::location::Location;
use crate::data::Data;
use crate::weather_requests;
use std::error::Error;
use termion::event::Key;

use super::util::stateful_list::StatefulList;

pub enum InputState {
    Idle,
    Insert,
    Delete,
}

enum MessageTypes {
    CarEntryInd,
    CarEntryCfm(String),
    CarExit
}

pub struct App {
    pub should_quit: bool,
    pub locations: StatefulList<Location>,
    pub input_state: InputState,
    pub new_location_name: String,
    pub data: Data,
}

impl App {
    pub fn new(locations: Vec<Location>, data: Data) -> App {
        let mut locations = StatefulList::with_items(locations);
        if !locations.items.is_empty() {
            locations.next();
        }
        App {
            should_quit: false,
            locations,
            input_state: InputState::Idle,
            new_location_name: String::from(""),
            data,
        }
    }

    pub async fn on_key(&mut self, key: Key) {
        match self.input_state {
            InputState::Idle => self.on_key_idle(key),
            InputState::Insert => self.on_key_insert(key).await,
            InputState::Delete => self.on_key_delete(key),
        };
    }

    fn on_key_idle(&mut self, key: Key) {
        if let Key::Char(c) = key {
            match c {
                'q' => self.should_quit = true,
                'j' => self.locations.next(),
                'k' => self.locations.previous(),
                '\n' => self.input_state = InputState::Insert,
                'd' => self.input_state = InputState::Delete,
                ' ' => self.select_current_location(),
                _ => (),
            }
        }
    }

    fn on_key_delete(&mut self, key: Key) {
        if let Key::Char('d') = key {
            self.confirm_delete()
        }
        self.input_state = InputState::Idle;
    }

    fn confirm_delete(&mut self) {
        if let Some(location) = self.locations.selected() {
            if self.data.delete_location(location).is_ok() {
                self.locations
                    .items
                    .remove(self.locations.state.selected().unwrap()); //Unwrap should be allowed since it implicitly checked above
                self.locations.state.select(Some(0));
            }
        }
    }

    async fn on_key_insert(&mut self, key: Key) {
        match key {
            Key::Char(c) => match c {
                '\n' => {
                    match self.confirm_new_location().await {
                        Ok(_) => (),
                        Err(_) => self.cancel_new_location(),
                    };
                }
                _ => self.new_location_name.push(c),
            },
            Key::Backspace => {
                self.new_location_name.pop();
            }
            Key::Esc => {
                self.cancel_new_location();
            }
            _ => (),
        }
    }

    async fn confirm_new_location(&mut self) -> Result<(), Box<dyn Error>> {
        if !self.new_location_name.is_empty() {
            let name = self.new_location_name.clone();
            let handle = tokio::task::spawn_blocking(move || Location::new(name));

            if let Some(mut location) = handle.await? {
                if self.data.insert_location(&location).is_ok() {
                    location.weather =
                        Some(weather_requests::get_hourly_for_location(&location).await?);
                    self.locations.items.push(location);
                    self.new_location_name = String::from("");
                }
            }
        }
        self.input_state = InputState::Idle;
        Ok(())
    }

    fn cancel_new_location(&mut self) {
        self.new_location_name = String::from("");
        self.input_state = InputState::Idle
    }

    fn select_current_location(&mut self) {
        if let Some(current) = self.locations.selected() {
            if self.data.select_location(current).is_ok() {
                let current_name = current.name.clone();
                for location in self.locations.items.iter_mut() {
                    location.selected = location.name == current_name;
                }
            }
        }
    }

    pub fn on_tick(&self) {}
}
