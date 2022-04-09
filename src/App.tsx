import { getPeople, getCountries } from "./DataApi";
import { Country, GetCounriesResponse } from "DataApi/country.interface";
import { GetPeopleResponse, People } from "DataApi/people.interface";
import React, { useEffect, useState, useCallback } from "react";
import debounce from "lodash.debounce";
import { searchCountries } from "api-usage-example";

const App: React.FunctionComponent = () => {
  const [people, setPeople] = useState<People[]>([]);
  console.log("~ people", people);
  const [resetPeople, setResetPeople] = useState<People[]>([]);
  const [foundResults, setFoundResults] = useState<number>();
  const [resetFoundResults, setResetFoundResults] = useState<number>();
  const [totalResults, setTotalResults] = useState<number>();
  const [resetTotalResults, setResetTotalResults] = useState<number>();
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  console.log("~ allCountries", allCountries);
  useEffect(() => {
    firstRender();
  }, []);

  const firstRender = async () => {
    const getAllPeopleResult = await getPeople({});
    console.log("~ getAllPeopleResult", getAllPeopleResult);
    setPeople(getAllPeopleResult.searchResults);
    setResetPeople(getAllPeopleResult.searchResults);
    setFoundResults(getAllPeopleResult.searchResultCount);
    setResetFoundResults(getAllPeopleResult.searchResultCount);
    setTotalResults(getAllPeopleResult.totalResultCounter);
    setResetTotalResults(getAllPeopleResult.totalResultCounter);
    const result: GetCounriesResponse = await searchCountries();
    setAllCountries(result.searchResults);
  };

  const age = (birthday: string) => {
    let today = new Date();
    let birthdayYear = new Date(birthday).getFullYear();
    // console.log("~ birthdayYear", birthdayYear);
    let year = today.getFullYear();
    // console.log("~ year", year);

    return year - birthdayYear;
  };

  const changeHandler = async (search: string) => {
    const people: GetPeopleResponse = await getPeople({ search });

    const countriesObj = allCountries.reduce((map, obj) => {
      map[obj.alpha2Code] = obj.flag;
      return map;
    }, {});
    console.log("🚀 ~ countriesObj", countriesObj);

    const peopleWithFlag = people.searchResults.map((objP) => {
      return { ...objP, flag: countriesObj[objP.country] };
    });
    console.log("🚀 ~ peopleWithFlag", peopleWithFlag);

    setPeople(peopleWithFlag);
    setFoundResults(people?.searchResultCount);
    setTotalResults(people?.totalResultCounter);
  };

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 300), []);

  return (
    <div className="pageWrapper">
      <p>Search Component</p>
      <input
        type="search"
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
          if (e?.currentTarget?.value.length > 2) {
            debouncedChangeHandler(e?.currentTarget?.value);
          } else {
            console.log("LESS THEN 3 CHARS");
            setTimeout(() => {
              setPeople(resetPeople);
              setFoundResults(resetFoundResults);
              setTotalResults(resetTotalResults);
            }, 1000);
          }
          // searchPeople(e?.currentTarget?.value); //
        }}
      />
      <p>List Component</p>
      <div className="listWrapper">
        {people.map((obj: People) => {
          return (
            <div key={obj.id}>
              <p>
                {obj.first_name} {obj.last_name}
              </p>
              <p>{obj.country}</p>
              <p>{age(obj.date_of_birth)}</p>
              <img className="flag" height={50} src="Flag src" alt="Flag alt" />
            </div>
          );
        })}
      </div>
      <p>Found results: {foundResults} </p>
      <p>Total results: {totalResults}</p>
    </div>
  );
};

export default App;
