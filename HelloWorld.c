void kernelMain() {
    char *vidmem = (char *) 0xb8000;
    unsigned int i = 0;

    while (i < (80 * 25 * 2)) {
        *(vidmem + i) = ' ';
        i++;
        *(vidmem + i) = 0x07;
        i++;
    }

    unsigned int line = 0;
    char *message = "Oiee :3";
    i = (line * 80 * 2);

    while (*(message) != 0) {
        if (*(message) == '\n') {
            line++;
            i = (line * 80 * 2);
            message++;
        } else {
            *(vidmem + i) = *(message);
            message++;
            i++;
            *(vidmem + i) = 0x07;
            i++;
        }
    }
}
