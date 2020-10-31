# adapted from https://stackoverflow.com/questions/946738/detect-key-press-non-blocking-w-o-getc-gets-in-ruby
# post 9

loop do
    # a simple key listener for linux
    system("stty raw -echo") # wait a keypress without enter
    char = STDIN.read_nonblock(1) rescue nil
    system("stty -raw echo")
    break if /q/i =~ char # waits a 'q' keypress
    # here goes your code
    sleep 0.1 
    puts 'test key listener linux'
end

#esp32.close (when 'q' key is pressed, closes the connection)

