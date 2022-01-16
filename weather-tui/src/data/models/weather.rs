use serde::{Deserialize, Serialize};

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WeatherRoot {
    pub lat: f64,
    pub lon: f64,
    pub timezone: String,
    #[serde(rename = "timezone_offset")]
    pub timezone_offset: i64,
    pub current: Option<Current>,
    pub hourly: Option<Vec<Hourly>>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Current {
    pub dt: i64,
    pub sunrise: i64,
    pub sunset: i64,
    pub temp: f64,
    #[serde(rename = "feels_like")]
    pub feels_like: f64,
    pub pressure: i64,
    pub humidity: i64,
    #[serde(rename = "dew_point")]
    pub dew_point: f64,
    pub uvi: f64,
    pub clouds: i64,
    #[serde(rename = "wind_speed")]
    pub wind_speed: f64,
    #[serde(rename = "wind_deg")]
    pub wind_deg: i64,
    pub weather: Vec<Weather>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Weather {
    pub id: i64,
    pub main: String,
    pub description: String,
    pub icon: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Hourly {
    pub dt: i64,
    pub temp: f64,
    #[serde(rename = "feels_like")]
    pub feels_like: f64,
    pub pressure: i64,
    pub humidity: i64,
    #[serde(rename = "dew_point")]
    pub dew_point: f64,
    pub clouds: i64,
    #[serde(rename = "wind_speed")]
    pub wind_speed: f64,
    #[serde(rename = "wind_deg")]
    pub wind_deg: i64,
    pub weather: Vec<Weather>,
    pub rain: Option<Rain>,
    pub snow: Option<Snow>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Rain {
    #[serde(rename = "1h")]
    pub n1_h: f64,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Snow {
    #[serde(rename = "1h")]
    pub n1_h: f64,
}

#[derive(Debug)]
pub enum WeatherType {
    Thunderstorm,
    Drizzle,
    Rain,
    Snow,
    Atmosphere,
    Clear,
    SomeClouds,
    Clouds,
    PlaceHolder,
}

impl Weather {
    pub fn get_weather_type(&self) -> WeatherType {
        match self.id {
            0..=299 => WeatherType::Thunderstorm,
            300..=499 => WeatherType::Drizzle,
            500..=599 => WeatherType::Rain,
            600..=699 => WeatherType::Snow,
            700..=799 => WeatherType::Atmosphere,
            800 => WeatherType::Clear,
            801 => WeatherType::SomeClouds,
            802..=899 => WeatherType::Clouds,
            _ => WeatherType::PlaceHolder,
        }
    }
}

impl WeatherType {
    pub fn to_icon(&self) -> &str {
        match self {
            WeatherType::Thunderstorm => "朗",
            WeatherType::Drizzle => "殺",
            WeatherType::Rain => "歹",
            WeatherType::Snow => "",
            WeatherType::Atmosphere => "敖",
            WeatherType::Clear => "",
            WeatherType::SomeClouds => "",
            WeatherType::Clouds => "",
            WeatherType::PlaceHolder => "  ",
        }
    }

    pub fn to_color_string(&self) -> &str {
        match self {
            WeatherType::Thunderstorm => "#ead919",
            WeatherType::Drizzle => "#6e8daf",
            WeatherType::Rain => "#0465d3",
            WeatherType::Snow => "#d1e5fc",
            WeatherType::Atmosphere => "#9ea8b2",
            WeatherType::Clear => "#fe8019",
            WeatherType::SomeClouds => "#fe8019",
            WeatherType::Clouds => "#919496",
            WeatherType::PlaceHolder => "#ffffff",
        }
    }

    pub fn to_color_values(&self) -> (u8, u8, u8) {
        let color_string = self.to_color_string();
        let value = hex::decode(&color_string[1..7]).unwrap();
        (value[0], value[1], value[2])
    }
}
