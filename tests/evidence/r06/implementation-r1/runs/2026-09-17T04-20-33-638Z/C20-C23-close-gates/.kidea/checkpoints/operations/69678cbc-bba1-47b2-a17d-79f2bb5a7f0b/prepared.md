# Kidea write checkpoint — byte evidence, not approval

<!-- kidea:data:start -->
```json
{
  "schemaVersion": 2,
  "projectId": "synthetic-r02-t04",
  "kind": "checkpoint",
  "id": "69678cbc-bba1-47b2-a17d-79f2bb5a7f0b",
  "ownerId": "impact-955cca1ceba45052d85984d3",
  "createdAt": "2026-09-17T04:21:23.179Z",
  "tool": {
    "version": "kidea-schema2-review-local-r2",
    "components": [
      {
        "name": "kidea.mjs",
        "integrity": {
          "method": "SHA256",
          "value": "2d320458255a3691542132a13a2c7c270b27cac8b8d371e418335c5a68cdf913",
          "byteLength": 5670
        }
      },
      {
        "name": "init.mjs",
        "integrity": {
          "method": "SHA256",
          "value": "3849a127f2b3e30653540036508bc6b636fbc84358e61489d4f4be95bdc31992",
          "byteLength": 11011
        }
      },
      {
        "name": "bootstrap-plan.mjs",
        "integrity": {
          "method": "SHA256",
          "value": "7446032d28b5a30b674eb82ed27225903f919f5992f7f60c157b171527db8933",
          "byteLength": 9719
        }
      },
      {
        "name": "write-internal.mjs",
        "integrity": {
          "method": "SHA256",
          "value": "716695d991005a5730d99530b68a4fac30ff501b81ba286d76f2a64187014fff",
          "byteLength": 37018
        }
      },
      {
        "name": "git-versions.mjs",
        "integrity": {
          "method": "SHA256",
          "value": "1bd0f696e1c96cf6c04aed32215dcc100b479fae86c6d9bf5b0e8780a6653680",
          "byteLength": 4875
        }
      },
      {
        "name": "runtime.mjs",
        "integrity": {
          "method": "SHA256",
          "value": "c32abd0fc8a8beafb49d0db18498e17058683ed93ee0e720d8305195c09f3270",
          "byteLength": 2052
        }
      },
      {
        "name": "status.mjs",
        "integrity": {
          "method": "SHA256",
          "value": "32419f6b86bbc7e7b16ed7b8546928a9241846699cfc22b3cc2970a389525292",
          "byteLength": 29164
        }
      },
      {
        "name": "schema.mjs",
        "integrity": {
          "method": "SHA256",
          "value": "1ce11eb44ba1266b2036142e3c46d9f70e4d33617637db1725734c596aa8397a",
          "byteLength": 6054
        }
      },
      {
        "name": "pending-writes.mjs",
        "integrity": {
          "method": "SHA256",
          "value": "0f4f91036e9e940b19480c09cb6b2c8bdc47a917b5e7267fab6d298bcac75bcc",
          "byteLength": 2295
        }
      },
      {
        "name": "recorded-completion.mjs",
        "integrity": {
          "method": "SHA256",
          "value": "3ae0fc74fff1796f56e7ebdad092aec13de74408d2e4ba8e4c436430c3ff3054",
          "byteLength": 998
        }
      },
      {
        "name": "node-24.19.0-darwin-x64",
        "integrity": {
          "method": "SHA256",
          "value": "1052eb9c7d6c60a79b968e09f75af55a73462b0f6dff0964336d63b5e13eb63c",
          "byteLength": 123666640
        }
      },
      {
        "name": "approve.mjs",
        "integrity": {
          "method": "SHA256",
          "value": "218dc9adc54751a5dadba56b560be4791b074027d9a575636ede35f24c6b22cf",
          "byteLength": 12434
        }
      },
      {
        "name": "review-validity.mjs",
        "integrity": {
          "method": "SHA256",
          "value": "705d60562b9751e1620fade778517eef114b38807ab47e9d29239f311a4a492e",
          "byteLength": 2342
        }
      }
    ]
  },
  "permissionRefs": [
    {
      "source": {
        "path": ".kidea/reviews/evidence/R06-fixture-69678cbc-bba1-47b2-a17d-79f2bb5a7f0b-0.md",
        "anchor": null
      },
      "location": {
        "kind": "SNAPSHOT",
        "ref": {
          "path": ".kidea/reviews/evidence/R06-fixture-69678cbc-bba1-47b2-a17d-79f2bb5a7f0b-0.md",
          "anchor": null
        }
      },
      "integrity": {
        "method": "SHA256",
        "value": "3aa0acd96e4223df11bc8a449f4c48ab44a75a423990d7d3fc542c27b9cb33ef",
        "byteLength": 51
      }
    }
  ],
  "inputRefs": [
    {
      "source": {
        "path": ".kidea/reviews/evidence/R06-fixture-69678cbc-bba1-47b2-a17d-79f2bb5a7f0b-1.md",
        "anchor": null
      },
      "location": {
        "kind": "SNAPSHOT",
        "ref": {
          "path": ".kidea/reviews/evidence/R06-fixture-69678cbc-bba1-47b2-a17d-79f2bb5a7f0b-1.md",
          "anchor": null
        }
      },
      "integrity": {
        "method": "SHA256",
        "value": "bae674acce5fd98f06046ea8aa5e3a930cc36ed21f6996e4b80496e73694e787",
        "byteLength": 756
      }
    }
  ],
  "targets": [
    {
      "path": ".kidea/reviews/evidence/R06-fixture-69678cbc-bba1-47b2-a17d-79f2bb5a7f0b-0.md",
      "action": "CREATE",
      "before": null,
      "planned": {
        "version": {
          "source": {
            "path": ".kidea/reviews/evidence/R06-fixture-69678cbc-bba1-47b2-a17d-79f2bb5a7f0b-0.md",
            "anchor": null
          },
          "location": {
            "kind": "SNAPSHOT",
            "ref": {
              "path": ".kidea/checkpoints/operations/69678cbc-bba1-47b2-a17d-79f2bb5a7f0b/planned-0.bin",
              "anchor": null
            }
          },
          "integrity": {
            "method": "SHA256",
            "value": "3aa0acd96e4223df11bc8a449f4c48ab44a75a423990d7d3fc542c27b9cb33ef",
            "byteLength": 51
          }
        },
        "cleanup": null
      }
    },
    {
      "path": ".kidea/reviews/evidence/R06-fixture-69678cbc-bba1-47b2-a17d-79f2bb5a7f0b-1.md",
      "action": "CREATE",
      "before": null,
      "planned": {
        "version": {
          "source": {
            "path": ".kidea/reviews/evidence/R06-fixture-69678cbc-bba1-47b2-a17d-79f2bb5a7f0b-1.md",
            "anchor": null
          },
          "location": {
            "kind": "SNAPSHOT",
            "ref": {
              "path": ".kidea/checkpoints/operations/69678cbc-bba1-47b2-a17d-79f2bb5a7f0b/planned-1.bin",
              "anchor": null
            }
          },
          "integrity": {
            "method": "SHA256",
            "value": "bae674acce5fd98f06046ea8aa5e3a930cc36ed21f6996e4b80496e73694e787",
            "byteLength": 756
          }
        },
        "cleanup": null
      }
    },
    {
      "path": ".kidea/reviews/evidence/R06-fixture-69678cbc-bba1-47b2-a17d-79f2bb5a7f0b-2.md",
      "action": "CREATE",
      "before": null,
      "planned": {
        "version": {
          "source": {
            "path": ".kidea/reviews/evidence/R06-fixture-69678cbc-bba1-47b2-a17d-79f2bb5a7f0b-2.md",
            "anchor": null
          },
          "location": {
            "kind": "SNAPSHOT",
            "ref": {
              "path": ".kidea/checkpoints/operations/69678cbc-bba1-47b2-a17d-79f2bb5a7f0b/planned-2.bin",
              "anchor": null
            }
          },
          "integrity": {
            "method": "SHA256",
            "value": "1f9abb128b1e32d0b5780e2b83b042fcacf2eac729031bf845a22dd73c4fb5df",
            "byteLength": 3604
          }
        },
        "cleanup": null
      }
    },
    {
      "path": ".kidea/reviews/evidence/R06-fixture-69678cbc-bba1-47b2-a17d-79f2bb5a7f0b-3.md",
      "action": "CREATE",
      "before": null,
      "planned": {
        "version": {
          "source": {
            "path": ".kidea/reviews/evidence/R06-fixture-69678cbc-bba1-47b2-a17d-79f2bb5a7f0b-3.md",
            "anchor": null
          },
          "location": {
            "kind": "SNAPSHOT",
            "ref": {
              "path": ".kidea/checkpoints/operations/69678cbc-bba1-47b2-a17d-79f2bb5a7f0b/planned-3.bin",
              "anchor": null
            }
          },
          "integrity": {
            "method": "SHA256",
            "value": "be6b4e30f339d47325ec2560ef2fab1c8b1d976fcf7c09d20eed6d79442570fd",
            "byteLength": 290
          }
        },
        "cleanup": null
      }
    },
    {
      "path": ".kidea/reviews/R06-fixture.md",
      "action": "UPDATE",
      "before": {
        "version": {
          "source": {
            "path": ".kidea/reviews/R06-fixture.md",
            "anchor": null
          },
          "location": {
            "kind": "SNAPSHOT",
            "ref": {
              "path": ".kidea/checkpoints/operations/69678cbc-bba1-47b2-a17d-79f2bb5a7f0b/before-4.bin",
              "anchor": null
            }
          },
          "integrity": {
            "method": "SHA256",
            "value": "1f9abb128b1e32d0b5780e2b83b042fcacf2eac729031bf845a22dd73c4fb5df",
            "byteLength": 3604
          }
        },
        "cleanup": null
      },
      "planned": {
        "version": {
          "source": {
            "path": ".kidea/reviews/R06-fixture.md",
            "anchor": null
          },
          "location": {
            "kind": "SNAPSHOT",
            "ref": {
              "path": ".kidea/checkpoints/operations/69678cbc-bba1-47b2-a17d-79f2bb5a7f0b/planned-4.bin",
              "anchor": null
            }
          },
          "integrity": {
            "method": "SHA256",
            "value": "df607a15c8aba3f5051886cfee99129b114338f49575ccd0dc6020af36d0f566",
            "byteLength": 4095
          }
        },
        "cleanup": null
      }
    }
  ],
  "observations": [],
  "nextAction": "Prepared only. Reconcile actual bytes before continuing an interrupted operation."
}
```
<!-- kidea:data:end -->
