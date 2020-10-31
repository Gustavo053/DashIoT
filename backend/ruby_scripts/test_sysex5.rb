require 'rubygems'
require 'arduino_firmata'
#path C:\Ruby27-x64\lib\ruby\gems\2.7.0\gems\arduino_firmata-0.3.7


esp32 = ArduinoFirmata.connect '/dev/ttyUSB0'

rawV = 0 #inicializacao

#registro (listener)
esp32.on :sysex do |command, data|
    if command == 0x02
        #puts "data : #{data.inspect}" #[x,0,y,0,z,0,.....] size: 2n 
        #agrega bytes do dado em si - reconstrucao
        dataHwToFw = 0
        for i in 8..(data.size-1)
            if i % 2 == 0 then
                dataHwToFw += data[i]
            end
        end
        rawV = dataHwToFw # o que recebeu do HW (a leitura em si)
        #print rawV
    end

    # if command == 0x04
    #      #puts "command : #{command}"
    #      puts "data : #{data.inspect}" #[x,0,y,0,z,0,.....] size: 2n
    #      #agrega bytes do dado em si - reconstrucao
    #      dataHwToFw = 0
    #      for i in 8..(data.size-1)
    #          if i % 2 == 0 then
    #              dataHwToFw += data[i]
    #          end
    #      end
    #      puts dataHwToFw
    #  end
end

pinToWrite  = 19
pinToRead  = 33
channel = 0 #ESP32 [0,16] - ver pinout esp32, mas qualquer pino digital é PWM também
freq = 5 #ESP32 [1, 40 Mhz] - Colocar valor / 1000 pois é multiplicado no .cpp por 1.000

#a freq maxima do pwm se baseia no clock de 80 MHz e eh limitada pela resolucao escolhida
#o calculo eh clock/resolucao = fmax, logo, para 8 bits (256), faz-se 80.000.000/256=312,5kHz
#para 10 bits (1024), tem-se fmax = 78 kHz - a vantagem é não precisar mapear de 8 bits para 10 bits,
#pois configuramos o ADC do esp32 para 10 bits.

#VER https://portal.vidadesilicio.com.br/controle-de-potencia-via-pwm-esp32/

resolution = 10 #ESP32 [1,16] 0..1023

dataFwToHw = []
# parte fixa (pin, level)
dataFwToHw.push(pinToWrite)
#Canal: 0 – 15.
dataFwToHw.push(channel)
#Freq ESP32: 1 – 40MHz.
dataFwToHw.push(freq)
#Resolution: 1 – 16 bits.
dataFwToHw.push(resolution)

# parte dinamica
v = rawV.divmod 127
#print v[0]
#print v[1]
#print v [quociente, resto] o nBytes é o quociente + 1 e o resto é o que passa para o segundo byte
#v[0] é o número de bytes de 7 bits CHEIOS e v[1] o que sobra para o próximo byte
for i in 1..v[0]
    dataFwToHw.push(127)
end

if v[0] >= 1 then
   dataFwToHw.push(v[1])
else
   dataFwToHw.push(rawV) 
end

print dataFwToHw

loop do
   esp32.sysex 0x02, [pinToRead]
   esp32.sysex 0x04, dataFwToHw
   sleep 0.1
end


