// INCLUDES
#include <rgb-controls/rgb-controls.h>
using namespace RGBControls;

/*
Regarding PWM Pin Options:
https://docs.particle.io/datasheets/photon-(wifi)/photon-datasheet/
*/
Led ledInstA(D0, D1, D2); // RGB
int ledInstA_State = 0;

Led ledInstB(A4, WKP, RX);
int ledInstB_State = 0;

// Color variables
Color red(255, 0, 0);
Color green(0, 255, 0);
Color blue(0, 0, 255);
Color yellow(255, 255, 0);
Color magenta(255, 0, 255);
Color cyan(0, 255, 255);
Color colors[6] = {red, green, blue, yellow, magenta, cyan};

void init() {}

void sendMsg(String msgType, String msg) {
    String message = msgType + " :: " + msg + " @";
    Serial.print(message);
    Serial.print(Time.timeStr());
}

void setup() {
    Serial.begin(9600);
    Particle.function("notification", handleNotification);
}

void loop() {
    
    if (!Particle.connected()) {
        sendMsg("ERROR", "Attempting to reconnect.");
        Particle.connect();
    }
    
    if (ledInstA_State == 1) {
        ledInstA.fade(blue.withBrightness(2), blue.withBrightness(50), 3000);
        ledInstB.fade(blue.withBrightness(2), blue.withBrightness(50), 3000);
    } else if (ledInstA_State == 0) {
        ledInstA.off();
        ledInstB.off();
    }
}

long handleNotification(String command) {
    sendMsg("SUCCESS", command);
    
    Particle.publish(command);
    
    if (command == "opened") {
        ledInstA_State = 1;
        ledInstB_State = 1;
    }
    if (command == "closed") {
        ledInstA_State = 0;
        ledInstB_State = 0;
    }
    
    return 1;
    
}

STARTUP( init() );

// CURL:
// -----
// curl https://api.particle.io/v1/devices/{DEVICE_ID}/notification \
//   -d access_token={ACCESS_TOKEN} \
//   -d arg=[opened|closed]
// WEBHOOK:
// --------
// https://api.particle.io/v1/devices/{DEVICE_ID}/notification?access_token={ACCESS_TOKEN}
