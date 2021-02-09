extern crate cc;

fn main(){
    cc::Build::new()
        .file("src/lib/device.c")
        .include("src")
        .compile("device.a");
}
