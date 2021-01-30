extern crate libc;
extern crate uinput_sys;
extern crate serde_json;


use libc::{c_int, c_char};
use std::ffi::CString;
use std::{thread, time};
use std::io;
use std::io::prelude::*;
use serde_json::Value as JsonValue;

#[allow(improper_ctypes)]
extern "C"{
    static fd: c_int;
    fn sync_events();
    fn press(code: c_int);
    fn release(code: c_int);
    fn click(code: c_int);
    fn setup_dpad_events();
    fn setup_gamepad_events(amt: c_int);
    fn setup_menupad_events();
    fn create_device();
    fn destroy_device();
    fn open_path(path: c_char);
    fn open_default();
}


fn main() {
    unsafe {
        open_default();
        setup_gamepad_events(4);
        setup_dpad_events();
        create_device();
        for line in io::stdin().lock().lines() {
            let res = serde_json::from_str::<JsonValue>(&mut line.unwrap());
            if res.is_ok(){
                let inp: JsonValue = res.unwrap();
                press(uinput_sys::BTN_SOUTH);
                sync_events();
                println!("PRESS");
                thread::sleep(time::Duration::from_secs(5));
                release(uinput_sys::BTN_SOUTH);
                sync_events();
                println!("RELEASE");
                thread::sleep(time::Duration::from_secs(5));
            } else {
                println!("failed to read json input");
            }
        }
    }
}
