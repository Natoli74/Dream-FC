# Web Development Project 7 - _Dream FC_

Submitted by: **Natoli Tesgera**

This web app: **A soccer team management application where users can create, view, edit, and delete players for their dream squad.**

Time spent: **4** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **The web app contains a page that features a create form to add a new crewmate**
  - Users can name the crewmate (player name)
  - Users can set the crewmate's attributes by clicking on one of several values (position, speed, nationality)
- [x] **The web app includes a summary page of all the user's added crewmates**
  - The web app contains a summary page dedicated to displaying all the crewmates the user has made so far (Gallery page)
  - The summary page is sorted by creation date such that the most recently created crewmates appear at the top
- [x] **A previously created crewmate can be updated from the list of crewmates in the summary page**
  - Each crewmate has an edit button that will take users to an update form for the relevant crewmate
  - Users can see the current attributes of their crewmate on the update form
  - After editing the crewmate's attribute values using the form, the user can immediately see those changes reflected in the update form and on the summary page
- [x] **A previously created crewmate can be deleted from the crewmate list**
  - Using the edit form detailed in the previous _crewmates can be updated_ feature, there is a button that allows users to delete that crewmate
  - After deleting a crewmate, the crewmate should no longer be visible in the summary page
- [x] **Each crewmate has a direct, unique URL link to an info page about them**
  - Clicking on a crewmate in the summary page navigates to a detail page for that crewmate (Player Detail page)
  - The detail page contains extra information about the crewmate not included in the summary page
  - Users can navigate to the edit form from the detail page

The following **optional** features are implemented:

- [x] A section of the summary page displays summary statistics about a user's crew on their crew page

The following **additional** features are implemented:

- [x] Country validation with 200+ supported countries and flag emoji display
- [x] Dynamic player avatars using DiceBear API based on position (Goalkeeper, Defender, Midfielder, Forward)

## Video Walkthrough

Here's a walkthrough of implemented features:

<img src='src/assets/web102_p_.gif' title='Video Walkthrough' width='600' alt='Video Walkthrough'/>

GIF created with [Ezgif](https://ezgif.com/)


## Notes

Integrated Supabase for database management and implemented comprehensive country validation system.

## License

    Copyright 2025 Natoli Tesgera

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
