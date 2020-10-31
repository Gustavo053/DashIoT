# #!/usr/bin/env ruby
$:.unshift File.expand_path '../../lib', File.dirname(__FILE__)
require 'rubygems'
require 'arduino_firmata'

esp32 = ArduinoFirmata.connect "/dev/ttyUSB0" 
puts "firmata version #{esp32.version}"

## regist event
esp32.on :sysex do |command, data|
    if command == 0x02
        puts "command : #{command}"
        puts "data    : #{data.inspect}"
        sleep 2
    end 
end

## send sysex command at the digital tratament case 0x02.
esp32.sysex 0x02, [18, 19]  #read at pin 22 and write at pin 23

loop do
    sleep 1
end 