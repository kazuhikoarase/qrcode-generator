function lie<<<__Explicit>> T>(mixed $var): T {
    /*HH_FIXME[4110] Lie to Hack*/
    return $var;
}

function reified_cast<reify T>(mixed $in): T {
    return lie<T>($in);
}

function print_string(string $string): void {
    print($string);
}
