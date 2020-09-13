# YAPF - Yet Another Plane Finder

YAPF is yet another plane finder for FSEconomy.

When searching for planes and jobs in FSEconomy in combination with Microsoft Flight Simulator (2020) I noticed that the ability of searching for **multiple planes** around **multiple airports** would be quite handy. Combining this with a filter that shows only rentable airplanes and also displays the **Since 100hr Inspection**-counter would be pretty helpful.

Hence I built this simple tool on top of node.js and express.

# Install

- Download and run `node install`
- Run the server with `node app.js`

# TODOs

- add datatables to the project to make the result table's columns sortable
- colorcode jobs number (0% = red, 100% = green, lerp colors for percentages in between)
- beautify with some additional css
- housekeeping... (make code better readable and mantainable, some of this was written quick and dirty)
- switch to typescript
- switch to scss
- add imprint etc.