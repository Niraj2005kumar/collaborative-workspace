import { useEffect, useState } from "react";
import { getCards } from "../services/api";
import Card from "./Card";

const List = ({ list }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = async () => {
    try {
      const res = await getCards(list._id);

      setCards(res.data.cards || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [list._id]);

  return (
    <div className="list-column">

      <div className="list-header">
        <h3>{list.title}</h3>

        <button className="add-card-btn">
          + Card
        </button>
      </div>

      <div className="cards-container">

        {loading ? (
          <p>Loading...</p>
        ) : cards.length > 0 ? (
          cards.map((card) => (
            <Card
              key={card._id}
              card={card}
            />
          ))
        ) : (
          <div className="empty-card">
            No Cards Found
          </div>
        )}

      </div>

    </div>
  );
};

export default List;