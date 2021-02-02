extern crate uinput_sys;
extern crate serde_json;
extern crate clap;


// for changing rust str into i8 {c string}
use std::ffi::CString;
use std::{thread, time, io};
use std::io::prelude::*;
use serde_json::Value as JsonValue;
use clap::{App, load_yaml};

// custom device.rs file definitions
// device.rs holds all our c code
mod device;


fn command_args(){
    // command line arguments
    let yml = load_yaml!("cli.yml");
    let cla = App::from_yaml(yml).get_matches();
    unsafe {
        if let path = cla.value_of("path").unwrap(){
            device::open_default();
        }
        if let dpad = cla.value_of("dpad").unwrap(){
            device::setup_dpad_events();
        }
        if let buttons = cla.value_of("gp-buttons").unwrap(){
            device::setup_gamepad_events(4);
        }
        if let menupad = cla.value_of("menupad").unwrap(){
            device::setup_menupad_events();
        }
        if let name = cla.value_of("name").unwrap(){
            device::create_device();
        }
    }
}



fn main() {
    // command line arguments using clap
    command_args();
    // loop for takeing stdin until EOF
    for line in io::stdin().lock().lines() {
        let res = serde_json::from_str::<JsonValue>(&mut line.unwrap());
        if res.is_ok(){
            let inp: JsonValue = res.unwrap();

            unsafe{
                device::press(uinput_sys::BTN_SOUTH);
                device::sync_events();
                println!("PRESS");
                thread::sleep(time::Duration::from_secs(5));
                device::release(uinput_sys::BTN_SOUTH);
                device::sync_events();
                println!("RELEASE");
                thread::sleep(time::Duration::from_secs(5));
            }
        } else {
            println!("Failed to read Json from stdin");
        }
    }
    unsafe { device::destroy_device();}
}
