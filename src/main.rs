extern crate uinput;


mod device;
use device::{create_controller};

use std::thread;
use std::time::Duration;
use std::io;

// creates a test device called KeyboardTest
// places that test device into out controller struct for later use
// runs a for loop 10 times so we get 10 keypresses
fn main() {
    let mut test = create_controller("KeyboardTest");
    println!("Test Controller Movements");
//    for _ in 0..1 {
//        let mut input = String::new();
// 
//        match io::stdin().read_line(&mut input) {
//        Ok(_) => {
//            test.click_event(&input.trim());
//        },
//        Err(e) => println!("Error has occured {}", e)
//        }
//        thread::sleep(Duration::from_secs(1));
//    }
    test.buttons_pressed();
    thread::sleep(Duration::from_secs(10));
}
