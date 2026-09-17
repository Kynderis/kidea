# DỮ LIỆU GIẢ — không phải xác nhận hoặc kết quả chạy thật

<!-- kidea:data:start -->
```json
{
  "schemaVersion": 2,
  "projectId": "synthetic-r02-t04",
  "kind": "work",
  "currentRoundId": "ROUND-001",
  "currentItemId": "W-002",
  "rounds": [
    {
      "id": "ROUND-001",
      "name": "Đợt giả",
      "type": "MVP",
      "scopeRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "targetVersion": "2.0.0",
      "releaseRef": {
        "path": "docs/operations/RL-001.md",
        "id": "RL-001",
        "revision": 1,
        "recordVersion": {
          "source": {
            "path": "docs/operations/RL-001.md",
            "anchor": null
          },
          "location": {
            "kind": "SNAPSHOT",
            "ref": {
              "path": "docs/operations/evidence/release-r1.snapshot",
              "anchor": null
            }
          },
          "integrity": {
            "method": "SHA256",
            "value": "c9e1829c885839b524a96bf8a61903942bd85e542e41ea8bd906907d46859ff6",
            "byteLength": 5720
          }
        }
      }
    }
  ],
  "items": [
    {
      "id": "W-001",
      "roundId": "ROUND-001",
      "name": "Mẫu W-001",
      "kind": "STEP",
      "parentId": null,
      "shape": "GROUP",
      "decomposition": "PARTIAL",
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": null
    },
    {
      "id": "W-002",
      "roundId": "ROUND-001",
      "name": "Mẫu W-002",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [
        "RV-001"
      ],
      "resultRefs": [],
      "executionStatus": "IN_PROGRESS"
    },
    {
      "id": "TEST-1",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 1",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [
        {
          "path": "docs/notes.md",
          "anchor": null
        }
      ],
      "executionStatus": "DONE"
    },
    {
      "id": "TEST-2",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 2",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-3",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 3",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-4",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 4",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-5",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 5",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-6",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 6",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-7",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 7",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-8",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 8",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-9",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 9",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-10",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 10",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-11",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 11",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-12",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 12",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-13",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 13",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-14",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 14",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-15",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 15",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-16",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 16",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-17",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 17",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-18",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 18",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-19",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 19",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-20",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 20",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-21",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 21",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-22",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 22",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-23",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 23",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-24",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 24",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-25",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 25",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-26",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 26",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-27",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 27",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-28",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 28",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-29",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 29",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-30",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 30",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-31",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 31",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-32",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 32",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-33",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 33",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-34",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 34",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-35",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 35",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-36",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 36",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-37",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 37",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-38",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 38",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-39",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 39",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-40",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 40",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-41",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 41",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-42",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 42",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-43",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 43",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-44",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 44",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-45",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 45",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-46",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 46",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-47",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 47",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-48",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 48",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-49",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 49",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-50",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 50",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-51",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 51",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-52",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 52",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-53",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 53",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-54",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 54",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-55",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 55",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-56",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 56",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-57",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 57",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-58",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 58",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-59",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 59",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-60",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 60",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-61",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 61",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-62",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 62",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-63",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 63",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-64",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 64",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-65",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 65",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-66",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 66",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-67",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 67",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-68",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 68",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-69",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 69",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-70",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 70",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-71",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 71",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-72",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 72",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-73",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 73",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-74",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 74",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-75",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 75",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-76",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 76",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-77",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 77",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-78",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 78",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-79",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 79",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-80",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 80",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-81",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 81",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-82",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 82",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-83",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 83",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-84",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 84",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-85",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 85",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-86",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 86",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-87",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 87",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-88",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 88",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-89",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 89",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-90",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 90",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-91",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 91",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-92",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 92",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-93",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 93",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-94",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 94",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-95",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 95",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-96",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 96",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-97",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 97",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-98",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 98",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-99",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 99",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-100",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 100",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-101",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 101",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-102",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 102",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-103",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 103",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-104",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 104",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-105",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 105",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-106",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 106",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-107",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 107",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-108",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 108",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-109",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 109",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-110",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 110",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-111",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 111",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-112",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 112",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-113",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 113",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-114",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 114",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-115",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 115",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-116",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 116",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-117",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 117",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-118",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 118",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-119",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 119",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-120",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 120",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-121",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 121",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-122",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 122",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-123",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 123",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-124",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 124",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-125",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 125",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-126",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 126",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-127",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 127",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-128",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 128",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-129",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 129",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-130",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 130",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-131",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 131",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-132",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 132",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-133",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 133",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-134",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 134",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-135",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 135",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-136",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 136",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-137",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 137",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-138",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 138",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-139",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 139",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-140",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 140",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-141",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 141",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-142",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 142",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-143",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 143",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-144",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 144",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-145",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 145",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-146",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 146",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-147",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 147",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-148",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 148",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-149",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 149",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-150",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 150",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-151",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 151",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-152",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 152",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-153",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 153",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-154",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 154",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-155",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 155",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-156",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 156",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-157",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 157",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-158",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 158",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-159",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 159",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-160",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 160",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-161",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 161",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-162",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 162",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-163",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 163",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-164",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 164",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-165",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 165",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-166",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 166",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-167",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 167",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-168",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 168",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-169",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 169",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-170",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 170",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-171",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 171",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-172",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 172",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-173",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 173",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-174",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 174",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-175",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 175",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-176",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 176",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-177",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 177",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-178",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 178",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-179",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 179",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-180",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 180",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-181",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 181",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-182",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 182",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-183",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 183",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-184",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 184",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-185",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 185",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-186",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 186",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-187",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 187",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-188",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 188",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-189",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 189",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-190",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 190",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-191",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 191",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-192",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 192",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-193",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 193",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-194",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 194",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-195",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 195",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-196",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 196",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-197",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 197",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-198",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 198",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-199",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 199",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-200",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 200",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-201",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 201",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-202",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 202",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-203",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 203",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-204",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 204",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-205",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 205",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-206",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 206",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-207",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 207",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-208",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 208",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-209",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 209",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-210",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 210",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-211",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 211",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-212",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 212",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-213",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 213",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-214",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 214",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-215",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 215",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-216",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 216",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-217",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 217",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-218",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 218",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-219",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 219",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-220",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 220",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-221",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 221",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-222",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 222",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-223",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 223",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-224",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 224",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-225",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 225",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-226",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 226",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-227",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 227",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-228",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 228",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-229",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 229",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-230",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 230",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-231",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 231",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-232",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 232",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-233",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 233",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-234",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 234",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-235",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 235",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-236",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 236",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-237",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 237",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-238",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 238",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-239",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 239",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-240",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 240",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-241",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 241",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-242",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 242",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-243",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 243",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-244",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 244",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-245",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 245",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-246",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 246",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-247",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 247",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-248",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 248",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-249",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 249",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-250",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 250",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-251",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 251",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-252",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 252",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-253",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 253",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-254",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 254",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-255",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 255",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-256",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 256",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-257",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 257",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-258",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 258",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-259",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 259",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-260",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 260",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-261",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 261",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-262",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 262",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-263",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 263",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-264",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 264",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-265",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 265",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-266",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 266",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-267",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 267",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-268",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 268",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-269",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 269",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-270",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 270",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-271",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 271",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-272",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 272",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-273",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 273",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-274",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 274",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-275",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 275",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-276",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 276",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-277",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 277",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-278",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 278",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-279",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 279",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-280",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 280",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-281",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 281",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-282",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 282",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-283",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 283",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-284",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 284",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-285",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 285",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-286",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 286",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-287",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 287",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-288",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 288",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-289",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 289",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-290",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 290",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-291",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 291",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-292",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 292",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-293",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 293",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-294",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 294",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-295",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 295",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-296",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 296",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-297",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 297",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-298",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 298",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-299",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 299",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-300",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 300",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-301",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 301",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-302",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 302",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-303",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 303",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-304",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 304",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-305",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 305",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-306",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 306",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-307",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 307",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-308",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 308",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-309",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 309",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-310",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 310",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-311",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 311",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-312",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 312",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-313",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 313",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-314",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 314",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-315",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 315",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-316",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 316",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-317",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 317",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-318",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 318",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-319",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 319",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-320",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 320",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-321",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 321",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-322",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 322",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-323",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 323",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-324",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 324",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-325",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 325",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-326",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 326",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-327",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 327",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-328",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 328",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-329",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 329",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-330",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 330",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-331",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 331",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-332",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 332",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-333",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 333",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-334",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 334",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-335",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 335",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-336",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 336",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-337",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 337",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-338",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 338",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-339",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 339",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-340",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 340",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-341",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 341",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-342",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 342",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-343",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 343",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-344",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 344",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-345",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 345",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-346",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 346",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-347",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 347",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-348",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 348",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-349",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 349",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-350",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 350",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-351",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 351",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-352",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 352",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-353",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 353",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-354",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 354",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-355",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 355",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-356",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 356",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-357",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 357",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-358",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 358",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-359",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 359",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-360",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 360",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-361",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 361",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-362",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 362",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-363",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 363",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-364",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 364",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-365",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 365",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-366",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 366",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-367",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 367",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-368",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 368",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-369",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 369",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-370",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 370",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-371",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 371",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-372",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 372",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-373",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 373",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-374",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 374",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-375",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 375",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-376",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 376",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-377",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 377",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-378",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 378",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-379",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 379",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-380",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 380",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-381",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 381",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-382",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 382",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-383",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 383",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-384",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 384",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-385",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 385",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-386",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 386",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-387",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 387",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-388",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 388",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-389",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 389",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-390",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 390",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-391",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 391",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-392",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 392",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-393",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 393",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-394",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 394",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-395",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 395",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-396",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 396",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-397",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 397",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-398",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 398",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-399",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 399",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-400",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 400",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-401",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 401",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-402",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 402",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-403",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 403",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-404",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 404",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-405",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 405",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-406",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 406",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-407",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 407",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-408",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 408",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-409",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 409",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-410",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 410",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-411",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 411",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-412",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 412",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-413",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 413",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-414",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 414",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-415",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 415",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-416",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 416",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-417",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 417",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-418",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 418",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-419",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 419",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-420",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 420",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-421",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 421",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-422",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 422",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-423",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 423",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-424",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 424",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-425",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 425",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-426",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 426",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-427",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 427",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-428",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 428",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-429",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 429",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-430",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 430",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-431",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 431",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-432",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 432",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-433",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 433",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-434",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 434",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-435",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 435",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-436",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 436",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-437",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 437",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-438",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 438",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-439",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 439",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-440",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 440",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-441",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 441",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-442",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 442",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-443",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 443",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-444",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 444",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-445",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 445",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-446",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 446",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-447",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 447",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-448",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 448",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-449",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 449",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-450",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 450",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-451",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 451",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-452",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 452",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-453",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 453",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-454",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 454",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-455",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 455",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-456",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 456",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-457",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 457",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-458",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 458",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-459",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 459",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-460",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 460",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-461",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 461",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-462",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 462",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-463",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 463",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-464",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 464",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-465",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 465",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-466",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 466",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-467",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 467",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-468",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 468",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-469",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 469",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-470",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 470",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-471",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 471",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-472",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 472",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-473",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 473",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-474",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 474",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-475",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 475",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-476",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 476",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-477",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 477",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-478",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 478",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-479",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 479",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-480",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 480",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-481",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 481",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-482",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 482",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-483",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 483",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-484",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 484",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-485",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 485",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-486",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 486",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-487",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 487",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-488",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 488",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-489",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 489",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-490",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 490",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-491",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 491",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-492",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 492",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-493",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 493",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-494",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 494",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-495",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 495",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-496",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 496",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-497",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 497",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-498",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 498",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-499",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 499",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-500",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 500",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-501",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 501",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-502",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 502",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-503",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 503",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-504",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 504",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-505",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 505",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-506",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 506",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-507",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 507",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-508",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 508",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-509",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 509",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-510",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 510",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-511",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 511",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-512",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 512",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-513",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 513",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-514",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 514",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-515",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 515",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-516",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 516",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-517",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 517",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-518",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 518",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-519",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 519",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-520",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 520",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-521",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 521",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-522",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 522",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-523",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 523",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-524",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 524",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-525",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 525",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-526",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 526",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-527",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 527",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-528",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 528",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-529",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 529",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-530",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 530",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-531",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 531",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-532",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 532",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-533",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 533",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-534",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 534",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-535",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 535",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-536",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 536",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-537",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 537",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-538",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 538",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-539",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 539",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-540",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 540",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-541",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 541",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-542",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 542",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-543",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 543",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-544",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 544",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-545",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 545",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-546",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 546",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-547",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 547",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-548",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 548",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-549",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 549",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-550",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 550",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-551",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 551",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-552",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 552",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-553",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 553",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-554",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 554",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-555",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 555",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-556",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 556",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-557",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 557",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-558",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 558",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-559",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 559",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-560",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 560",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-561",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 561",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-562",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 562",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-563",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 563",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-564",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 564",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-565",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 565",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-566",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 566",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-567",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 567",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-568",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 568",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-569",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 569",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-570",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 570",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-571",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 571",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-572",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 572",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-573",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 573",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-574",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 574",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-575",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 575",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-576",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 576",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-577",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 577",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-578",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 578",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-579",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 579",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-580",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 580",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-581",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 581",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-582",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 582",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-583",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 583",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-584",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 584",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-585",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 585",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-586",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 586",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-587",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 587",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-588",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 588",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-589",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 589",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-590",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 590",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-591",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 591",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-592",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 592",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-593",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 593",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-594",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 594",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-595",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 595",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-596",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 596",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-597",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 597",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-598",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 598",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-599",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 599",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-600",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 600",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-601",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 601",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-602",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 602",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-603",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 603",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-604",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 604",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-605",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 605",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-606",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 606",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-607",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 607",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-608",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 608",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-609",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 609",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-610",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 610",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-611",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 611",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-612",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 612",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-613",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 613",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-614",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 614",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-615",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 615",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-616",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 616",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-617",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 617",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-618",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 618",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-619",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 619",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-620",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 620",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-621",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 621",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-622",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 622",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-623",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 623",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-624",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 624",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-625",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 625",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-626",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 626",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-627",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 627",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-628",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 628",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-629",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 629",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-630",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 630",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-631",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 631",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-632",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 632",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-633",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 633",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-634",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 634",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-635",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 635",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-636",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 636",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-637",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 637",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-638",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 638",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-639",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 639",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-640",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 640",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-641",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 641",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-642",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 642",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-643",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 643",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-644",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 644",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-645",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 645",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-646",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 646",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-647",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 647",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-648",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 648",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-649",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 649",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-650",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 650",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-651",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 651",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-652",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 652",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-653",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 653",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-654",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 654",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-655",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 655",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-656",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 656",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-657",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 657",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-658",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 658",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-659",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 659",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-660",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 660",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-661",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 661",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-662",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 662",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-663",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 663",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-664",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 664",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-665",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 665",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-666",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 666",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-667",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 667",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-668",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 668",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-669",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 669",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-670",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 670",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-671",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 671",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-672",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 672",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-673",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 673",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-674",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 674",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-675",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 675",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-676",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 676",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-677",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 677",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-678",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 678",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-679",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 679",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-680",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 680",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-681",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 681",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-682",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 682",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-683",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 683",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-684",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 684",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-685",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 685",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-686",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 686",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-687",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 687",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-688",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 688",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-689",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 689",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-690",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 690",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-691",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 691",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-692",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 692",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-693",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 693",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-694",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 694",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-695",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 695",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-696",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 696",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-697",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 697",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-698",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 698",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-699",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 699",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-700",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 700",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-701",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 701",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-702",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 702",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-703",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 703",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-704",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 704",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-705",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 705",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-706",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 706",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-707",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 707",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-708",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 708",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-709",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 709",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-710",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 710",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-711",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 711",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-712",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 712",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-713",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 713",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-714",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 714",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-715",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 715",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-716",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 716",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-717",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 717",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-718",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 718",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-719",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 719",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-720",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 720",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-721",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 721",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-722",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 722",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-723",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 723",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-724",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 724",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-725",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 725",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-726",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 726",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-727",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 727",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-728",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 728",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-729",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 729",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-730",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 730",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-731",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 731",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-732",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 732",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-733",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 733",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-734",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 734",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-735",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 735",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-736",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 736",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-737",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 737",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-738",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 738",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-739",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 739",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-740",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 740",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-741",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 741",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-742",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 742",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-743",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 743",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-744",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 744",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-745",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 745",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-746",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 746",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-747",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 747",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-748",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 748",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-749",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 749",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-750",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 750",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-751",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 751",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-752",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 752",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-753",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 753",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-754",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 754",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-755",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 755",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-756",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 756",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-757",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 757",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-758",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 758",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-759",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 759",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-760",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 760",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-761",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 761",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-762",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 762",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-763",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 763",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-764",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 764",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-765",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 765",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-766",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 766",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-767",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 767",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-768",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 768",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-769",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 769",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-770",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 770",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-771",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 771",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-772",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 772",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-773",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 773",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-774",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 774",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-775",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 775",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-776",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 776",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-777",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 777",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-778",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 778",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-779",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 779",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-780",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 780",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-781",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 781",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-782",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 782",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-783",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 783",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-784",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 784",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-785",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 785",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-786",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 786",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-787",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 787",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-788",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 788",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-789",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 789",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-790",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 790",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-791",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 791",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-792",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 792",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-793",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 793",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-794",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 794",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-795",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 795",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-796",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 796",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-797",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 797",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-798",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 798",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-799",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 799",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-800",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 800",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-801",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 801",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-802",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 802",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-803",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 803",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-804",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 804",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-805",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 805",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-806",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 806",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-807",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 807",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-808",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 808",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-809",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 809",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-810",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 810",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-811",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 811",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-812",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 812",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-813",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 813",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-814",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 814",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-815",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 815",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-816",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 816",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-817",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 817",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-818",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 818",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-819",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 819",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-820",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 820",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-821",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 821",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-822",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 822",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-823",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 823",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-824",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 824",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-825",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 825",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-826",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 826",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-827",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 827",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-828",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 828",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-829",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 829",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-830",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 830",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-831",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 831",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-832",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 832",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-833",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 833",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-834",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 834",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-835",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 835",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-836",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 836",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-837",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 837",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-838",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 838",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-839",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 839",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-840",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 840",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-841",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 841",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-842",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 842",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-843",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 843",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-844",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 844",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-845",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 845",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-846",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 846",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-847",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 847",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-848",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 848",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-849",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 849",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-850",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 850",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-851",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 851",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-852",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 852",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-853",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 853",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-854",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 854",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-855",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 855",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-856",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 856",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-857",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 857",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-858",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 858",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-859",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 859",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-860",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 860",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-861",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 861",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-862",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 862",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-863",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 863",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-864",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 864",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-865",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 865",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-866",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 866",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-867",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 867",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-868",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 868",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-869",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 869",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-870",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 870",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-871",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 871",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-872",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 872",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-873",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 873",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-874",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 874",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-875",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 875",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-876",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 876",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-877",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 877",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-878",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 878",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-879",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 879",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-880",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 880",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-881",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 881",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-882",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 882",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-883",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 883",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-884",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 884",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-885",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 885",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-886",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 886",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-887",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 887",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-888",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 888",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-889",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 889",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-890",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 890",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-891",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 891",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-892",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 892",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-893",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 893",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-894",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 894",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-895",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 895",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-896",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 896",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-897",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 897",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-898",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 898",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-899",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 899",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-900",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 900",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-901",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 901",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-902",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 902",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-903",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 903",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-904",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 904",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-905",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 905",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-906",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 906",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-907",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 907",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-908",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 908",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-909",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 909",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-910",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 910",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-911",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 911",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-912",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 912",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-913",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 913",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-914",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 914",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-915",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 915",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-916",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 916",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-917",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 917",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-918",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 918",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-919",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 919",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-920",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 920",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-921",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 921",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-922",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 922",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-923",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 923",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-924",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 924",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-925",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 925",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-926",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 926",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-927",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 927",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-928",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 928",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-929",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 929",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-930",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 930",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-931",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 931",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-932",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 932",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-933",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 933",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-934",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 934",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-935",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 935",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-936",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 936",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-937",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 937",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-938",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 938",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-939",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 939",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-940",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 940",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-941",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 941",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-942",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 942",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-943",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 943",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-944",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 944",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-945",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 945",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-946",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 946",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-947",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 947",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-948",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 948",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-949",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 949",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-950",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 950",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-951",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 951",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-952",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 952",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-953",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 953",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-954",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 954",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-955",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 955",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-956",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 956",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-957",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 957",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-958",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 958",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-959",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 959",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-960",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 960",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-961",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 961",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-962",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 962",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-963",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 963",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-964",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 964",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-965",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 965",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-966",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 966",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-967",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 967",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-968",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 968",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-969",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 969",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-970",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 970",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-971",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 971",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-972",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 972",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-973",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 973",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-974",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 974",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-975",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 975",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-976",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 976",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-977",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 977",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-978",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 978",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-979",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 979",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-980",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 980",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-981",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 981",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-982",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 982",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-983",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 983",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-984",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 984",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-985",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 985",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-986",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 986",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-987",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 987",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-988",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 988",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-989",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 989",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-990",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 990",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-991",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 991",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-992",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 992",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-993",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 993",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-994",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 994",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-995",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 995",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-996",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 996",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-997",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 997",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-998",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 998",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "TEST-999",
      "roundId": "ROUND-001",
      "name": "Kiểm trách nhiệm 999",
      "kind": "TASK",
      "parentId": "W-001",
      "shape": "LEAF",
      "decomposition": null,
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": "TODO"
    },
    {
      "id": "UNEXPANDED",
      "roundId": "ROUND-001",
      "name": "Phần chưa phân rã",
      "kind": "STEP",
      "parentId": null,
      "shape": "GROUP",
      "decomposition": "UNEXPANDED",
      "scopeRef": {
        "path": "docs/plan.md",
        "anchor": "scope"
      },
      "inputRefs": [
        {
          "path": "docs/features.md",
          "anchor": "scope"
        }
      ],
      "completionRef": {
        "path": "docs/plan.md",
        "anchor": "completion"
      },
      "dependencyIds": [],
      "gateIds": [],
      "resultRefs": [],
      "executionStatus": null
    }
  ],
  "planRefs": [],
  "reviewRefs": [
    {
      "path": ".kidea/reviews/RV-001.md",
      "anchor": null
    }
  ],
  "blockers": [
    {
      "itemId": "W-002",
      "reason": "Cần review đúng phiên bản",
      "needed": "Human xem bằng chứng"
    }
  ],
  "returnStack": [],
  "nextAction": "Chờ Human review; không tự thực thi.",
  "checkpointRef": {
    "path": ".kidea/checkpoints/CP-001.md",
    "anchor": null
  }
}
```
<!-- kidea:data:end -->
