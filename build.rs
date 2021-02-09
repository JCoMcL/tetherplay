extern crate cc;
use std::process::Command;

fn main(){
    println!("8=============D~~~~~~~~~~~");

    let link_flags: &str = &*String::from_utf8_lossy(&(Command::new("pkg-config")
        .args(&["--static", "--libs", "libevdev"])
        .output()
        .expect("8=========D~~~~~~~~~~~~~~~~")
    ).stdout).as_ref().to_owned();

    cc::Build::new()
        .file("src/lib/device.c")
        .include("src")
        .include("/usr/include/libevdev-1.0")
        .flag(link_flags)
        .compile("device.a");
}
