import MealItem from "./MealItem.jsx";
import useHttp from "../hooks/useHttp.js";

import Error from "./Error.jsx";

const requestConfig = {}; // create the object once and assign it to a constant

export default function Meals() {
  // const [loadedMeals, setLoadedMeals] = useState([]);

  // useEffect(() => {
  //   async function fetchMeals() {
  //     const response = await fetch("http://localhost:3000/meals");

  //     if (!response.ok) {
  //       //...
  //     }

  //     const meals = await response.json();
  //     setLoadedMeals(meals);
  //   }

  //   fetchMeals(); // causes an infinite loop, so we have to wrap fetchMeals into useEffect hooks
  // }, []);

  const {
    data: loadedMeals, // alias as loadedMeals
    isLoading,
    error,
  } = useHttp("http://localhost:3000/meals", requestConfig, []); // a GET request, so config is unnecessary

  if (isLoading) {
    return <p className="center">Fetching meals...</p>;
  }

  if (error) {
    return <Error title="Failed to fetch meals" message={error} />;
  }

  // if (!data) {
  //   return <p>No meals found.</p>
  // }

  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
