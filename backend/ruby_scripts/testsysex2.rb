require 'rubygems'
require 'arduino_firmata'
#path C:\Ruby27-x64\lib\ruby\gems\2.7.0\gems\arduino_firmata-0.3.7


esp32 = ArduinoFirmata.connect '/dev/ttyUSB0'
#registro (listener)
esp32.on :sysex do |command, data|
    if command == 0x02
        puts "data : #{data.inspect}" #[x,0,y,0,z,0,.....] size: 2n
        #agrega bytes do dado em si - reconstrucao
        dataHwToFw = 0
        for i in 0..(data.size-1)
            if i % 2 == 0 then
                dataHwToFw += data[i]
            end
        end
        puts dataHwToFw # o que recebeu do HW (a leitura em si)
    end
end

pinToRead  = 33
dataFwToHw = []
# parte fixa (pin)
dataFwToHw.push(pinToRead)

print dataFwToHw
loop do
   esp32.sysex 0x02, dataFwToHw                             
   sleep 0.01
end
