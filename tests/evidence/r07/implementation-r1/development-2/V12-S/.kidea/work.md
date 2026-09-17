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
