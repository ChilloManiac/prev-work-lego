use crate::data::models::location::Location;
use crate::data::models::weather::WeatherRoot;
use crate::SECRETS;
use std::error::Error;

pub async fn get_hourly_for_location(location: &Location) -> Result<WeatherRoot, Box<dyn Error>> {
    let url = format_url_string(location.coord.y, location.coord.x, "minutely,daily,current");
    get(&url).await
}

pub async fn get_current_for_location(location: &Location) -> Result<WeatherRoot, Box<dyn Error>> {
    let url = format_url_string(location.coord.y, location.coord.x, "minutely,daily,hourly");
    get(&url).await
}

pub async fn get_hourly_for_lat_lon(lat: f64, lon: f64) -> Result<WeatherRoot, Box<dyn Error>> {
    let url = format_url_string(lat, lon, "minutely,daily,current");
    get(&url).await
}

async fn get(url: &str) -> Result<WeatherRoot, Box<dyn Error>> {
    Ok(reqwest::get(url).await?.json::<WeatherRoot>().await?)
}

fn format_url_string(lat: f64, lon: f64, exclude: &str) -> String {
    format!("https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid={key}&units=metric&exclude={exclude}",
        lat = lat,
        lon = lon,
        key = SECRETS.owm_key,
        exclude = exclude)
}
