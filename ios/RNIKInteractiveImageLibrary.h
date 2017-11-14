
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"
#else
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#endif
#import <CoreMotion/CoreMotion.h>
#import <QuartzCore/QuartzCore.h>

@interface RNIKInteractiveImageLibrary : RCTEventEmitter <RCTBridgeModule>

@property (strong, nonatomic) CMMotionManager *motionManager;
@property (strong, nonatomic) CADisplayLink *motionDisplayLink;
@property (nonatomic) double motionLastYaw;

@end
  
