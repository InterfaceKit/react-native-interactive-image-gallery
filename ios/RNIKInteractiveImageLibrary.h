
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <CoreMotion/CoreMotion.h>

@interface RNIKInteractiveImageLibrary : RCTEventEmitter <RCTBridgeModule>

@property (strong, nonatomic) CMMotionManager *motionManager;
@property (nonatomic) double motionLastYaw;

@end
