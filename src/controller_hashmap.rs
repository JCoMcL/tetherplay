extern crate uinput;

// uinput controller events
use uinput::event::controller::{GamePad, DPad};
use std::collections::HashMap;

// used for building the hashmap of GamePad inputs
fn build_gamepad_hashmap() -> HashMap<&'static str, GamePad>{
    let mut controller_game_pad: HashMap<&str, GamePad> = HashMap::with_capacity(13);
    controller_game_pad.insert("Y", GamePad::North);
    controller_game_pad.insert("A", GamePad::South);
    controller_game_pad.insert("X", GamePad::West);
    controller_game_pad.insert("B", GamePad::East);
    controller_game_pad.insert("LT", GamePad::TL);
    controller_game_pad.insert("RT", GamePad::TR);
    controller_game_pad.insert("LT2", GamePad::TL2);
    controller_game_pad.insert("RT2", GamePad::TR2);
    controller_game_pad.insert("Select", GamePad::Select);
    controller_game_pad.insert("Start", GamePad::Start);
    controller_game_pad.insert("ThumbL", GamePad::ThumbL);
    controller_game_pad.insert("ThumbR", GamePad::ThumbR);
    controller_game_pad.insert("Mode", GamePad::Mode);
    return controller_game_pad;
}
// this is used for building the hashmap for DPad inputs
fn build_dpad_hashmap() -> HashMap<&'static str, DPad>{
    let mut controller_dpad: HashMap<&str, DPad> = HashMap::with_capacity(4);
    controller_dpad.insert("Up", DPad::Up);
    controller_dpad.insert("Down", DPad::Down);
    controller_dpad.insert("Left", DPad::Left);
    controller_dpad.insert("Right", DPad::Right);
    return controller_dpad;
}
// simple serach function used for testing various inputs
pub fn search_hashmaps(name: &str) -> &str{
    let dpad_map = build_dpad_hashmap();
    let gamepad_map = build_gamepad_hashmap();

    if dpad_map.contains_key(name){
        return "This is a dpad button";
    } else if gamepad_map.contains_key(name){
        return "This is a gamepad button";
    } else {
        return "Cannot Find This Button";
    }
}
