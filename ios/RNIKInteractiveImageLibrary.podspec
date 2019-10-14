
Pod::Spec.new do |s|
  s.name         = "RNIKInteractiveImageLibrary"
  s.version      = "1.0.0"
  s.summary      = "RNIKInteractiveImageLibrary"
  s.description  = <<-DESC
                  RNIKInteractiveImageLibrary
                   DESC
  s.homepage     = "https://github.com/InterfaceKit/react-native-interactive-image-gallery"
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "author@domain.cn" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/author/RNIKInteractiveImageLibrary.git", :tag => "master" }
  s.source_files  = "*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end

  