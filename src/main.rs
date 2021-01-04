extern crate uinput;

use uinput::event::controller;

use std::thread;
use std::time::Duration;

// module controller
mod controller_hashmap;
use controller_hashmap::search_hashmaps;

// Useed for creating each device
// takes the devices name as input
// returns the device itself as an uinput device
// change keyboard to controller for controller inputs
pub fn create_device(name: &str) -> uinput::Device{
    return uinput::default().unwrap()
    .name(name).unwrap()
    .event(uinput::event::Controller::All).unwrap()
    .create().unwrap();
}

// used to create a controller object
// controller object only has the controller itslef for now
pub struct Contrl {
    contrl: uinput::Device,
}

// this is the functions for the controller object
impl Contrl {
    // for now it only sends the keyboard output of a and then sleeps for 1 seccond
    // the 1 seccond will be taken out later in the project
    pub fn keyboard_press_event(&mut self){
        // for controller input change keybaord to controller
        self.contrl.click(&controller::GamePad::North).unwrap();
        self.contrl.synchronize().unwrap();
        thread::sleep(Duration::from_secs(1));
    }
}

// creates a test device called KeyboardTest
// places that test device into out controller struct for later use
// runs a for loop 10 times so we get 10 keypresses
fn main() {
    let test = create_device("KeyboardTest");
    println!("{}", search_hashmaps("Up"));
    println!("{}", search_hashmaps("Select"));
    println!("{}", search_hashmaps("Down"));
    println!("{}", search_hashmaps("FUCK"));
    let mut dev = Contrl{contrl: test};
    for _ in 0..10 {
        dev.keyboard_press_event();
    }
}
