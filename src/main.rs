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
        // path or default should be run first
        if let path = cla.value_of("path").unwrap_or(""){
            // change path to a i8 string use Cstring it helps
            // needs to be converted before changing open_default to open_path
            println!("PathGiven");
            device::open_default();
        } else {
            println!("NoPathGiven");
            device::open_default();
        }
        if cla.value_of("dpad").unwrap_or("") == "true"{
            device::setup_dpad_events();
        }
        if cla.value_of("gp-west").unwrap_or("") == "true"{
            device::setup_gamepad_west();
        }
        if cla.value_of("gp-east").unwrap_or("") == "true"{
            device::setup_gamepad_east();
        }
        if cla.value_of("gp-south").unwrap_or("") == "true"{
            device::setup_gamepad_south();
        }
        if cla.value_of("gp-north").unwrap_or("") == "true"{
            device::setup_gamepad_north();
        }
        if cla.value_of("menupad").unwrap_or("") == "true"{
            device::setup_menupad_events();
        }
        // name must be called last after setting up all controller inputs
        if let name = cla.value_of("name").unwrap_or(""){
            // change name to a i8 string use Cstring it helps
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
            // depending on which input is given call a command

            unsafe{
                // use uinput_sys btn commands for c functions
                // when finsihed use sync events at end
                // remove thread and time when finished
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
    // destroys device at end of stdin
    unsafe { device::destroy_device();}
}

