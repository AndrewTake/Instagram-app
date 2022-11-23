.then(readDir())
.then(array) {
    array for each)png)
    grayscale(png)
}
grayscale(png,grayscale)

grayscale function 
png file and hook up readable stream to it

all we care about is the pixels

png js gives us a transform stream 
we now have an array from the transform stream, which gives us access to the pixel values

in the transform stream modify the colors

write it out in a writeable stream to destination (folder named greyscale)
