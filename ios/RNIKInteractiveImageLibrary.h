
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif
#import <CoreMotion/CoreMotion.h>
#import <QuartzCore/QuartzCore.h>

@interface RNIKInteractiveImageLibrary : NSObject <RCTBridgeModule>

@property (strong, nonatomic) CMMotionManager *motionManager;
@property (strong, nonatomic) CADisplayLink *motionDisplayLink;
@property (nonatomic) double motionLastYaw;

@end
  
