import { Avatar } from '@mui/material';

const AvatarUser = ({ text }) => {
  const stringColor = (s) => {
    if (!s) return "#cccccc"; // Возвращаем цвет по умолчанию, если строка отсутствует
    let hash = 0;
    let i;
    for (i = 0; i < s.length; i += 1) {
      hash = s.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  const avatarText = text ? `${text.split(" ")[0][0]}` : "?"; // Заглушка, если текст отсутствует

  return (
    <Avatar 
      sx={{
        backgroundColor: stringColor(text),
        width: 40,
        height: 40,
      }}
      children={avatarText}
    />
  );
};

export default AvatarUser;
