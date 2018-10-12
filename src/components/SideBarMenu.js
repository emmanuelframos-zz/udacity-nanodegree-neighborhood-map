import React from "react";

export const SideBarMenu = ({query, onChangeFilter, placesExhibited, handleKeyPress, listItem}) => (
  <div className="place-list">
    <input
      id="place-filter"
      className="form-control"
      type="text"
      placeholder="Filter Place..."
      value={query}
      onChange={onChangeFilter}
      aria-labelledby="Search a Place"
      tabIndex="1"
    />
    <ul className="place-item" aria-labelledby="list of places" tabIndex="1">
      {placesExhibited.map((place, index) => (
        <li
          key={index}
          tabIndex={index + 2}
          area-labelledby={`Informations of ${place.name}`}
          onKeyPress={handleKeyPress.bind(this, place)}
          onClick={listItem.bind(this, place)}
        >
          {place.name}
        </li>
      ))}
    </ul>
  </div>
);
