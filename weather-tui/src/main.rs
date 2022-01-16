mod data;
mod ui;
mod weather_requests;
use argh::FromArgs;
use data::models::secrets::Secrets;
use data::Data;
use std::{error::Error, fs::File, io::BufReader};
#[macro_use]
extern crate lazy_static;

lazy_static! {
    static ref SECRETS: Secrets = {
        let mut path = std::env::current_exe().unwrap();
        path.pop();
        let path = path.join(".secrets.json");
        let file = File::open(path).unwrap();
        let reader = BufReader::new(file);
        serde_json::from_reader(reader).unwrap()
    };
}

#[derive(FromArgs)]
/// Getting weather data
struct Args {
    /// prints selected temperature inline with icon, without the gui
    #[argh(switch, short = 's')]
    only_selected: bool,

    ///print without colors for status2d
    #[argh(switch, short = 'n')]
    no_colors: bool,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let args: Args = argh::from_env();
    let data = Data::new()?;
    if !args.only_selected {
        ui::start(data).await
    } else {
        if let Ok(location) = data.get_selected_location() {
            if let Ok(weather) = weather_requests::get_current_for_location(&location).await {
                let current = weather.current.unwrap();
                let weather_type = current.weather.first().unwrap().get_weather_type();
                if args.no_colors {
                    println!("{} {:.1}°C", weather_type.to_icon(), current.temp);
                } else {
                    println!(
                        "^c{}^{} ^d^ {:.1}°C",
                        weather_type.to_color_string(),
                        weather_type.to_icon(),
                        current.temp
                    );
                }
            } else {
                println!("Couldnt get data");
            }
        } else {
            println!("Please select a location in the GUI");
        }
        Ok(())
    }
}

