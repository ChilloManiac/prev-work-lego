use super::app::{App, InputState};
use crate::data::models::{location::Location, weather::Hourly};
use chrono::{DateTime, FixedOffset, NaiveDateTime};
use tui::{
    backend::Backend,
    layout::{Constraint, Direction, Layout, Rect},
    style::{Color, Modifier, Style},
    widgets::{Block, Borders, List, Paragraph, Text},
    Frame,
};

pub fn draw<B: Backend>(mut frame: Frame<B>, app: &mut App) {
    let chunks = Layout::default()
        .direction(Direction::Horizontal)
        .constraints([Constraint::Length(30), Constraint::Min(50)])
        .split(frame.size());

    draw_left(&mut frame, chunks[0], app);
    draw_right(&mut frame, chunks[1], app);
}

fn draw_left<B: Backend>(frame: &mut Frame<B>, area: Rect, app: &mut App) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Min(20), Constraint::Length(6)])
        .split(area);
    draw_list(frame, chunks[0], app);
    draw_input(frame, chunks[1], app);
}

fn draw_right<B: Backend>(frame: &mut Frame<B>, area: Rect, app: &App) {
    let chunks = Layout::default()
        .constraints([Constraint::Min(10)])
        .direction(Direction::Vertical)
        .margin(1)
        .split(area);

    let mut weather_block = Block::default().borders(Borders::ALL);
    if let Some(location) = app.locations.selected() {
        weather_block = weather_block.title(&location.name);
        draw_weather_table(frame, chunks[0], location);
    }
    frame.render_widget(weather_block, area);
}

fn draw_list<B: Backend>(frame: &mut Frame<B>, area: Rect, app: &mut App) {
    let items = app.locations.items.iter().map(|i| {
        let selected = if i.selected { "*" } else { "" };
        let mut display_name = i.name.clone();
        display_name.push_str(selected);

        Text::raw(display_name)
    });

    let location_list = List::new(items)
        .block(Block::default().title("Locations").borders(Borders::ALL))
        .highlight_style(Style::default().fg(Color::Yellow).modifier(Modifier::BOLD))
        .highlight_symbol(">>");

    frame.render_stateful_widget(location_list, area, &mut app.locations.state);
}

fn draw_input<B: Backend>(frame: &mut Frame<B>, area: Rect, app: &App) {
    let text = [Text::raw(&app.new_location_name)];
    let mut style = Style::default();

    if let InputState::Insert = app.input_state {
        style = style.bg(Color::White).fg(Color::Black);
    }

    let paragraph = Paragraph::new(text.iter())
        .block(Block::default().title("New Location").borders(Borders::ALL))
        .style(style)
        .wrap(true);

    frame.render_widget(paragraph, area);
}

fn draw_weather_table<B: Backend>(frame: &mut Frame<B>, area: Rect, location: &Location) {
    if let Some(weather_ref) = location.weather.as_ref() {
        let weather = weather_ref.clone();

        let mut constraints = vec![Constraint::Length(2); 25];
        constraints.push(Constraint::Min(2));

        let chunks = Layout::default()
            .direction(Direction::Vertical)
            .constraints(constraints)
            .margin(1)
            .split(area);
        draw_weather_header_row(frame, chunks[0]);
        for (hour, index) in weather
            .hourly
            .unwrap_or_default()
            .iter()
            .zip(0..)
            .filter(|(_, index)| index % 2 == 0)
            .take(24)
        {
            let row_index = index / 2;
            draw_weather_row(frame, chunks[row_index + 1], hour, weather.timezone_offset)
        }
    } else {
        let loading_text = vec![Text::raw("Loading...")];
        let loading_widget = Paragraph::new(loading_text.iter());
        frame.render_widget(loading_widget, area);
    }
}

fn split_row_chunks(area: Rect) -> Vec<Rect> {
    Layout::default()
        .constraints([
            Constraint::Length(10),
            Constraint::Min(0),
            Constraint::Length(12),
            Constraint::Length(12),
            Constraint::Length(4),
            Constraint::Length(10),
        ])
        .direction(Direction::Horizontal)
        .split(area)
}

fn draw_weather_header_row<B: Backend>(frame: &mut Frame<B>, area: Rect) {
    let chunks = split_row_chunks(area);

    let time_text = vec![Text::raw("Time")];
    let time_widget = Paragraph::new(time_text.iter());
    frame.render_widget(time_widget, chunks[0]);

    if chunks[1].width > 20 {
        let desc_text = vec![Text::raw("Description")];
        let desc_widget = Paragraph::new(desc_text.iter());
        frame.render_widget(desc_widget, chunks[1]);
    }

    let wind_text = vec![Text::raw("Wind")];
    let wind_widget = Paragraph::new(wind_text.iter());
    frame.render_widget(wind_widget, chunks[2]);

    let humidity_text = vec![Text::raw("Humidity")];
    let humidity_widget = Paragraph::new(humidity_text.iter());
    frame.render_widget(humidity_widget, chunks[3]);

    let temp_text = vec![Text::raw("Temp")];
    let temp_widget = Paragraph::new(temp_text.iter());
    frame.render_widget(temp_widget, chunks[5]);

    frame.render_widget(Block::default().borders(Borders::BOTTOM), area);
}

fn draw_weather_row<B: Backend>(
    frame: &mut Frame<B>,
    area: Rect,
    hour: &Hourly,
    timezone_offset: i64,
) {
    let chunks = split_row_chunks(area);

    let time = DateTime::<FixedOffset>::from_utc(
        NaiveDateTime::from_timestamp(hour.dt, 0),
        FixedOffset::east(timezone_offset as i32),
    )
    .format("%H:%M")
    .to_string();
    let time = vec![Text::raw(time)];
    let time_widget = Paragraph::new(time.iter());
    frame.render_widget(time_widget, chunks[0]);

    if let Some(weather) = hour.weather.first() {
        if chunks[1].width > 20 {
            let weather_text = vec![Text::raw(&weather.description)];
            let desc_widget = Paragraph::new(weather_text.iter());
            frame.render_widget(desc_widget, chunks[1]);
        }

        let weather_type = weather.get_weather_type();
        let (r, g, b) = weather_type.to_color_values();
        let icon_style = Style::default().fg(Color::Rgb(r, g, b));
        let icon = vec![Text::raw(weather_type.to_icon())];
        let icon_widget = Paragraph::new(icon.iter()).style(icon_style);
        frame.render_widget(icon_widget, chunks[4]);
    }

    let wind_speed = vec![Text::raw(format!("{:.1}m/s", hour.wind_speed))];
    let wind_speed_widget = Paragraph::new(wind_speed.iter());
    frame.render_widget(wind_speed_widget, chunks[2]);

    let humidity = vec![Text::raw(format!("{}%", hour.humidity))];
    let humidity_widget = Paragraph::new(humidity.iter());
    frame.render_widget(humidity_widget, chunks[3]);

    let temp = format!("{:.1}°C", hour.temp);
    let temp = vec![Text::raw(temp)];
    let temp_widget = Paragraph::new(temp.iter());
    frame.render_widget(temp_widget, chunks[5]);

    frame.render_widget(
        Block::default()
            .borders(Borders::BOTTOM)
            .style(Style::default().bg(Color::Blue)),
        area,
    );
}

/*
* Scrapped for now, cause it ugly
*/
// fn draw_temp_chart<B: Backend>(frame: &mut Frame<B>, area: Rect, location: &Location) {
//     if let Some(weather) = location.weather.as_ref() {
//         let weather = weather.clone();
//         let (r, g, b) = WeatherType::Clear.to_color_values();
//         let data: Vec<(&str, u64)> = weather
//             .hourly
//             .unwrap_or_default()
//             .iter()
//             .map(|hour| ("00", hour.temp as u64))
//             .collect();
//         let temp_chart = BarChart::default()
//             .bar_width(4)
//             .bar_gap(0)
//             .style(Style::default().fg(Color::Rgb(r, g, b)))
//             .data(&data);
//         frame.render_widget(temp_chart, area);
//     }
// }
