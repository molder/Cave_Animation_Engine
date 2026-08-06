{
  "targets": [
    {
      "target_name": "CaveNDI",
      "sources": [
        "addon.cpp"
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}