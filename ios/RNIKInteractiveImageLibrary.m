
#import "RNIKInteractiveImageLibrary.h"
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

@implementation RNIKInteractiveImageLibrary

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"MotionManager"];
}

- (id)init {
    if (self = [super init]) {
        self.motionManager = [[CMMotionManager alloc] init];
        self.motionManager.deviceMotionUpdateInterval = 0.02;  // 50 Hz
    }
    return self;
}

RCT_EXPORT_METHOD(startYawUpdates) {
    self.motionDisplayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(motionRefresh:)];
    [self.motionDisplayLink addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
    if ([self.motionManager isDeviceMotionActive]) {
        // To avoid using more CPU than necessary we use
        // `CMAttitudeReferenceFrameXArbitraryZVertical`
        [self.motionManager startDeviceMotionUpdatesUsingReferenceFrame:CMAttitudeReferenceFrameXArbitraryZVertical];
    }
}

- (void)motionRefresh:(id)sender {
    CMQuaternion quat = self.motionManager.deviceMotion.attitude.quaternion;
    double yaw = asin(2*(quat.x*quat.z - quat.w*quat.y));

    if (self.motionLastYaw == 0) {
        self.motionLastYaw = yaw;
    }

    // Kalman filtering
    static float q = 0.1;   // process noise
    static float r = 0.1;   // sensor noise
    static float p = 0.1;   // estimated error
    static float k = 0.5;   // kalman filter gain

    float x = self.motionLastYaw;
    p = p + q;
    k = p / (p + r);
    x = x + k*(yaw - x);
    p = (1 - k)*p;
    self.motionLastYaw = x;
    [self sendEventWithName:@"MotionManager"
                       body:@{@"yaw": [NSNumber numberWithDouble:self.motionLastYaw]}];
}

RCT_EXPORT_METHOD(stopYawUpdates) {
    [self.motionDisplayLink invalidate];
}

@end
