
import { getUserDataByToken } from '@/lib/server/auth';
import { createSlug } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface Props {
	blogTitle: string,
	blogUserId: number
}

export default function ConditionalEdit({ blogTitle, blogUserId }: Props) {
  const [userData, setUserData] = useState<any>(null);
  const [cookie, setCookie] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
	const fetchUser = async () => {
	  const cookiesString = document.cookie;
	  const cookieValue = cookiesString
		.split(';')
		.filter(cookie => cookie.trim().startsWith('osucookie='))
		.map(cookie => cookie.split('=')[1])[0];

	  setCookie(cookieValue);

	  if (cookieValue) {
		try {
		  const data = await getUserDataByToken(cookieValue);
		  setUserData(data);
		} catch {
		  setUserData(null);
		}
	  }
	  setLoading(false);
	};
	fetchUser();
  }, []);

  if (loading) {
	return null; // o un loader
  }

  if (!cookie) {
	return null; // o un mensaje de error
  }

  if (!userData) {
	return <>{cookie}</>; // o un mensaje de error
  }

  // Renderiza el botón de editar solo si el usuario es el autor
  if (userData.id === blogUserId) {
	return <a href={`./${createSlug(blogTitle)}/edit`}>Editar blog: {blogTitle}</a>;
  }

  return null;
}