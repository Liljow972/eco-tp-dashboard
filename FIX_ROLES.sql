-- Assurer que le compte de démo client a bien le rôle 'client'
UPDATE profiles
SET role = 'client'
WHERE email = 'client@ecotp.test' OR email = 'client@demo.com';

-- Assurer que le compte Admin principal a bien le rôle 'admin'
UPDATE profiles
SET role = 'admin'
WHERE email = 'ecotpmartinique@gmail.com' OR email = 'admin@ecotp.test';

-- Vérification (optionnel, pour l'output)
SELECT email, role FROM profiles WHERE email IN ('client@ecotp.test', 'ecotpmartinique@gmail.com', 'admin@ecotp.test');
