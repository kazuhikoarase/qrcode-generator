
function reified_cast<<<__Enforceable>> reify T>(mixed $in): T {
    return $in as T;
}

function print_string(string $string): void {
    print($string);
}
