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

/*
fn command_args(){
    // command line arguments
    let yml = load_yaml!("cli.yml");
    let cla = App::from_yaml(yml).get_matches();
    
    unsafe {
        // path or default should be run first
        let mut uinput_path = CString::new(
            cla.value_of("path").unwrap_or("/dev/uinput")
        ).expect("/dev/uinput").as_ptr();

        device::open_default();

        // name must be called last after setting up all controller inputs
        let name = cla.value_of("name").unwrap();
        device::create_device();
    }
}*/

fn main() {
    unsafe { device::create_device(); }
    //command_args();
    for line in io::stdin().lock().lines() {
        let res = serde_json::from_str::<JsonValue>(&mut line.unwrap());
        if res.is_ok(){
            let inp: JsonValue = res.unwrap();
            // depending on which input is given call a command
            println!("{:?}", inp.get("i"));

        } else {
            println!("Failed to read Json from stdin");
        }
    }
    // destroys device at end of stdin
    unsafe { device::cleanup();}
}

