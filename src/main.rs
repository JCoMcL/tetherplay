extern crate uinput_sys;
extern crate serde_json;
// for changing rust str into i8 {c string}
use std::ffi::CString;
use std::{thread, time, io};
use std::io::prelude::*;
use serde_json::Value as JsonValue;


// custom device.rs file definitions
// device.rs holds all our c code
mod device;


fn main() {

    // c functions are ran as unsafe
    unsafe {
        device::open_default();
        device::setup_gamepad_events(4);
        device::create_device();
    }
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
