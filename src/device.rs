extern crate uinput;

use uinput::event::controller;

// is unused for the time being
use std::thread;
use std::time::Duration;

// module controller
mod controller_hashmap;
use controller_hashmap::{build_gamepad_hashmap, build_dpad_hashmap, build_hashmap, ButtonValues};

use std::collections::HashMap;

// Useed for creating each device
// takes the devices name as input
// returns the device itself as an uinput device
// change keyboard to controller for controller inputs
pub fn create_controller(name: &str) -> Contrl{
    let gamepad = build_gamepad_hashmap();
    let dpad = build_dpad_hashmap();
    let buttons = build_hashmap();
    let dev = uinput::default().unwrap()
    .name(name).unwrap()
    .event(uinput::event::Controller::All).unwrap()
    .create().unwrap();

    return Contrl{contrl: dev,
                gamepad_map: gamepad,
                dpad_map: dpad,
                buttons_map: buttons,
            }
}

// used to create a controller object
// controller object only has the controller itslef for now
pub struct Contrl {
    pub contrl: uinput::Device,
    gamepad_map: HashMap<&'static str, controller::GamePad>,
    dpad_map: HashMap<&'static str, controller::DPad>,
    pub buttons_map: HashMap<&'static str, ButtonValues>,
}

// this is the functions for the controller object
impl Contrl {
    // for now it only sends the keyboard output of a and then sleeps for 1 seccond
    // the 1 seccond will be taken out later in the project
    pub fn click_event(&mut self, val: &str){
        if self.test_gamepad(val){
            self.click_event_gamepad(val);
        } else if self.test_dpad(val) {
            self.click_event_dpad(val);
        } else {
            println!("Error Button Not Recognised");
        }

    }
    pub fn buttons_pressed(&mut self){
        for x in ["Up", "Down", "Left", "Right", "Y", "B", "X", "A", "Start"].iter(){
            let btn = self.buttons_map.get(x).unwrap();
            if btn.gpad() != None {
                self.contrl.press(&btn.gpad().unwrap()).unwrap();
            } else{
                self.contrl.press(&btn.dir().unwrap()).unwrap(); 
            }
                
            self.contrl.synchronize().unwrap();
            thread::sleep(Duration::from_secs(3));
             if btn.gpad() != None{
                self.contrl.release(&btn.gpad().unwrap()).unwrap();
            } else{
                self.contrl.release(&btn.dir().unwrap()).unwrap(); 
            }
            self.contrl.synchronize().unwrap();


        }
    }
    fn click_event_gamepad(&mut self, val: &str){
        // for controller input change keybaord to controller
        let button: &uinput::event::controller::GamePad = self.gamepad_map.get(val).unwrap();
        self.contrl.click(button).unwrap();
        self.contrl.synchronize().unwrap();
        // taken out for testing
        //thread::sleep(Duration::from_secs(1));
    }
    fn click_event_dpad(&mut self, val: &str){
        // for controller input change keybaord to controller
        let button: &uinput::event::controller::DPad = self.dpad_map.get(val).unwrap();
        self.contrl.click(button).unwrap();
        self.contrl.synchronize().unwrap();
        // taken out for testing
        //thread::sleep(Duration::from_secs(1));
    }
    // press event keeps the button held down until the release event is triggered
    fn press_event(&mut self, evt: &uinput::event::Controller){
        self.contrl.press(evt).unwrap();
        self.contrl.synchronize().unwrap();
    }
    // release_event releases the button
    fn release_event(&mut self, evt: &uinput::event::Controller){
        self.contrl.release(evt).unwrap();
        self.contrl.synchronize().unwrap();
    }
    // this is for testing with the click event will be taken out after testing
    fn test_gamepad(&mut self, val: &str) -> bool{
        if self.gamepad_map.contains_key(val){
            return true;
        } else {
            return false;
        }
    }

    fn test_dpad(&mut self, val: &str) -> bool{
        if self.dpad_map.contains_key(val){
            return true;
        } else{
            return false;
        }
    }
}


