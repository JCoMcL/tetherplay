extern crate uinput;

use uinput::event::controller;


// is unused for the time being
//use std::thread;
//use std::time::Duration;

// module controller
mod controller_hashmap;
use controller_hashmap::{build_gamepad_hashmap, build_dpad_hashmap};

use std::collections::HashMap;

// Useed for creating each device
// takes the devices name as input
// returns the device itself as an uinput device
// change keyboard to controller for controller inputs
pub fn create_controller(name: &str) -> Contrl{
    let gamepad = build_gamepad_hashmap();
    let dpad = build_dpad_hashmap();
    let dev = uinput::default().unwrap()
    .name(name).unwrap()
    .event(uinput::event::Controller::All).unwrap()
    .create().unwrap();

    return Contrl{contrl: dev,
                gamepad_map: gamepad,
                dpad_map: dpad,
            }
}

// used to create a controller object
// controller object only has the controller itslef for now
pub struct Contrl {
    pub contrl: uinput::Device,
    gamepad_map: HashMap<&'static str, controller::GamePad>,
    dpad_map: HashMap<&'static str, controller::DPad>,
}

// this is the functions for the controller object
impl Contrl {
    // for now it only sends the keyboard output of a and then sleeps for 1 seccond
    // the 1 seccond will be taken out later in the project
    pub fn click_event(&mut self){
        // for controller input change keybaord to controller
        self.contrl.click(&controller::GamePad::North).unwrap();
        self.contrl.synchronize().unwrap();
        // taken out for testing
        //thread::sleep(Duration::from_secs(1));
    }

    pub fn test_gamepad(&mut self, val: &str) -> &str{
        if self.gamepad_map.contains_key(val){
            return "This Is GamePad";
        } else {
            return "This is not Gamepad";
        }
    }

    pub fn test_dpad(&mut self, val: &str) -> &str{
        if self.dpad_map.contains_key(val){
            return "This is DPad";
        } else{
            return "This is not DPad";
        }
    }
}


