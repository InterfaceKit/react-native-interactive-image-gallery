
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <CoreMotion/CoreMotion.h>
#import <QuartzCore/QuartzCore.h>

@interface RNIKInteractiveImageLibrary : RCTEventEmitter <RCTBridgeModule>

@property (strong, nonatomic) CMMotionManager *motionManager;
@property (strong, nonatomic) CADisplayLink *motionDisplayLink;
@property (nonatomic) double motionLastYaw;

@end
  
