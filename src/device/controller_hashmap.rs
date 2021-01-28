extern crate uinput;

// uinput controller events
use uinput::event::controller::{GamePad, DPad};
use std::collections::HashMap;

// used for building the hashmap of GamePad inputs
pub fn build_gamepad_hashmap() -> HashMap<&'static str, uinput::event::controller::GamePad>{
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
pub fn build_dpad_hashmap() -> HashMap<&'static str, DPad>{
    let mut controller_dpad: HashMap<&str, DPad> = HashMap::with_capacity(4);
    controller_dpad.insert("Up", DPad::Up);
    controller_dpad.insert("Down", DPad::Down);
    controller_dpad.insert("Left", DPad::Left);
    controller_dpad.insert("Right", DPad::Right);
    return controller_dpad;
}
#[derive(Clone, Copy)]
pub enum ButtonValues {
    GPad(uinput::event::controller::GamePad),
    Direction(uinput::event::controller::DPad),
}
impl ButtonValues{
    pub fn gpad(self) -> Option<uinput::event::controller::GamePad>{
        match self{
            ButtonValues::GPad(g) => Some(g),
            _ => None,
        }
    }

    pub fn dir(self) -> Option<uinput::event::controller::DPad>{
        match self{
            ButtonValues::Direction(d) => Some(d),
            _ => None,
        }
    }
}
pub fn build_hashmap() -> HashMap<&'static str, ButtonValues>{
    let mut controller_hashmap: HashMap<&str, ButtonValues> = HashMap::with_capacity(17);
    controller_hashmap.insert("Up", ButtonValues::Direction(DPad::Up));
    controller_hashmap.insert("Down", ButtonValues::Direction(DPad::Down));
    controller_hashmap.insert("Left", ButtonValues::Direction(DPad::Left));
    controller_hashmap.insert("Right", ButtonValues::Direction(DPad::Right));
    controller_hashmap.insert("Y", ButtonValues::GPad(GamePad::North));
    controller_hashmap.insert("A", ButtonValues::GPad(GamePad::South));
    controller_hashmap.insert("X", ButtonValues::GPad(GamePad::West));
    controller_hashmap.insert("B", ButtonValues::GPad(GamePad::East));
    controller_hashmap.insert("LT", ButtonValues::GPad(GamePad::TL));
    controller_hashmap.insert("RT", ButtonValues::GPad(GamePad::TR));
    controller_hashmap.insert("LT2", ButtonValues::GPad(GamePad::TL2));
    controller_hashmap.insert("RT2", ButtonValues::GPad(GamePad::TR2));
    controller_hashmap.insert("Select", ButtonValues::GPad(GamePad::Select));
    controller_hashmap.insert("Start", ButtonValues::GPad(GamePad::Start));
    controller_hashmap.insert("ThumbL", ButtonValues::GPad(GamePad::ThumbL));
    controller_hashmap.insert("ThumbR", ButtonValues::GPad(GamePad::ThumbR));
    controller_hashmap.insert("Mode", ButtonValues::GPad(GamePad::Mode));
    return controller_hashmap;
}
