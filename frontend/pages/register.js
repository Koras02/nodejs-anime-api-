// frontend/pages/register.js
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Home.module.css";

const RegisterAnimation = () => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [episodes, setEpisodes] = useState("");
  const [image, setImage] = useState(null);
  const [animations, setAnimations] = useState([]);
  const [message, setMessage] = useState("");
  const [trailer, setTrailer] = useState(""); // 트레일러 상태

  // 애니메이션 목록을 가져오는 함수
  const fetchAnimations = async () => {
    try {
      const response = await axios.get("http://localhost:3000/animations");
      setAnimations(response.data);
    } catch (error) {
      console.error("Error fetching animations:", error); // 오류 메시지 출력
    }
  };

  // 컴포넌트가 마운트될 때 애니메이션 목록을 가져옴
  useEffect(() => {
    fetchAnimations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("genre", genre);
    formData.append("episodes", episodes);
    if (image) {
      formData.append("image", image);
    }
    if (trailer) {
      formData.append("trailer", trailer); // 트레일러 URL
    }

    try {
      // 애니메이션 등록 요청
      await axios.post("http://localhost:3000/animations", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // 애니메이션 등록 후 목록을 다시 가져옴
      fetchAnimations();
      // 입력 필드 초기화
      setTitle("");
      setGenre("");
      setEpisodes("");
      setTrailer("");
      setMessage("이미지 등록 성공");
      setImage(null);
    } catch (error) {
      console.error("Error registering animation:", error); // 오류 메시지 출력
      setImage("이미지 등록 실패");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Episodes"
          value={episodes}
          onChange={(e) => setEpisodes(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <input
          type="trailer"
          placeholder="Trailer URL"
          value={trailer}
          onChange={(e) => setTrailer(e.target.value)}
        />
        <button className={styles.bt} type="submit">
          Register Animation
        </button>
      </form>

      <ul className={styles.list}>
        <h3 className={styles.title}>Registered Animations</h3>
        {animations.map((animation) => (
          <li key={animation._id} className={styles.item}>
            <div className={styles.formList}>
              <h4 className={styles.cardTitle}>{animation.title}</h4>
              <p className={styles.cardGenre}>{animation.genre}</p>
              <p className={styles.card - episodes}>
                {animation.episodes} episodes
              </p>
              {animation.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`http://localhost:3000/${animation.image}`}
                  alt={animation.title}
                  className={styles.images}
                />
              )}
              {animation.trailer && (
                <div>
                  <h5>Trailer:</h5>
                  <iframe
                    width="100%"
                    height="200"
                    src={`https://www.youtube.com/embed/${
                      animation.trailer.split("v=")[1]
                    }`} // URL 변환
                    title={animation.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegisterAnimation;
