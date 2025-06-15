<?php

$target = dirname(__DIR__) . '/storage/app/public';
$link = dirname(__DIR__) . '/public/storage';

if (!file_exists($link)) {
    symlink($target, $link);
    echo "Symlink created.";
} else {
    echo "Symlink already exists.";
}
