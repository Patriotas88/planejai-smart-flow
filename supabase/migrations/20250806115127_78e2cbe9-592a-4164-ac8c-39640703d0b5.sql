-- Remove a tabela atualizar que não está sendo usada e não tem RLS
DROP TABLE IF EXISTS public.atualizar;

-- Verificar e recriar o trigger para criação automática de perfis
-- Primeiro, vamos garantir que a função existe e está correta
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  RETURN new;
END;
$function$;

-- Remover o trigger existente se houver
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar o trigger para automaticamente criar perfis quando um usuário se cadastra
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();