# Introduction
This readme is supplementary information to the bulk import feature of OpenBeta.io (https://openbeta.io/import).

# Data Validation
## Client-Side Schema Validation
All uploaded data is validated against a JSON schema in the user's browser beforehand. The schema represents a simplified version of the actual database schema, specifically tailored to end-users in order to make it comfortable to mass-contribute climbing data to OpenBeta without needing to dive deep into technicalities. (For a full specification of the database, please refer to https://github.com/OpenBeta/openbeta-graphql).

## Server-Side Schema Validation
Each upload is tested against the database as an uncommitted transaction, only if each line has passed the validation against the database the whole file will be written.

# Example Files
This document will refer to the following example files:
* The schema file used for client-side validation: `https://openbeta.io/bulk-import/bulk-import-schema.json` 
* Example files that guide you how to structure your JSON files for mass upload
    * (1) `https://openbeta.io/bulk-import/example-uploads/add-areas-with-climbs.json`
    * (2) `https://openbeta.io/bulk-import/example-uploads/update-areas-with-climbs.json`
    * (3) `https://openbeta.io/bulk-import/example-uploads/update-climbs-with-pitches.json`

# Schema
## General Data Hierarchy
This is how OpenBeta's data is structured. Generally speaking, the database schema distinguishes between `Area`s and `Climb`s:

> - Country (`Area`)
>   - Region (`Area`)
>     - Sub-Region (`Area`)
>       - Sub-Sub-Region (`Area`)
>         - Crag 1 (`Area`)
>           - Sector 1 (`Area`)
>           - Sector 2 (`Area`)
>           - Sector N (`Area`)
>             - Climb 1 (`Climb`)
>             - Climb 2 (`Climb`)
>             - Climb N (`Climb`)
>               - Pitch 1 (`Climb.Pitch`)
>               - Pitch 2 (`Climb.Pitch`)
>         - Crag 2 (`Area`)
>         - Crag N (`Area`)


## Example
Let's look at the example `add-areas-with-climbs.json` for an illustration:

> - "USA" (Country, Type: `Area`)
>  - "Utah" (State, Type: `Area`)
>     - "Southeast Utah" (Region, Type: `Area`)
>        - "Indian Creek" (Crag, Type: `Area`)
>           - "Supercrack Buttress" (Sector, Type: `Area`)
>              - "The Key Flake" (Route, Type: `Climb`)
>              - "Incredible Hand Crack" (Route, Type: `Climb`)
>                  - "Pitch 1" (Pitch, Type: `Climb.Pitch`)
>                  - "Pitch 2" (Pitch, Type: `Climb.Pitch`)

### A note on `Area`s
* an `Area` may be a country, state, region, crag or sector (and may be infinetely nested)
* it is only the leaf area node that determines its type, which is automatically determined server-side based on certain criteria: 
   * an area with *climbs* => a *sector* (then, metadata property `isLeaf` is set to `TRUE`)
   * an area with *sectors* => a *crag* (not a leaf)
   * if an area has only boulders as children => *boulder field* (metadata property `isBoulder` is set to `TRUE`)

# How to Update Data
* On the use of `uuid`s  for `Area`, `Climb`, or `Climb.Pitch`:
    * The schema requires EITHER
        *`name` (for areas: `areaName`)
        * OR `uuid` (for pitches: `id`)
    * omitting an uuid => **creates** new entries
    * providing an uuid => **updates** existing entries

* Deleting climbs is not supported (join our Discord for help: https://discord.gg/a6vuuTQxS8)

# Nightly Database Dump
* Find all current database data here: https://github.com/OpenBeta/openbeta-export/tree/production (updated nightly)

