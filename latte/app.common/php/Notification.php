<?php

/**
 * Stub generated by xlatte
 */
class Notification extends notificationBase
{

	const USER = 1;
	const ROOT = 0;


	/**
	 * @remote
	 * @return number
	 */
	public static function checkNotifications()
	{
		$user = (isset($_SESSION['iduser'])) ? self::USER : self::ROOT;

		$result = DL::oneOf('Notification', "
			SELECT COUNT(*) AS total
			FROM notification
			WHERE viewed = false    
				AND user = '$user'
		");
		return $result->others['total'];
	}

	/**
	 * @remote
     * @param number $idproject
	 * @return number
	 */
	public static function checkNotificationsByProject($idproject)
	{
		$user = (isset($_SESSION['iduser'])) ? self::USER : self::ROOT;

		$query = "
            SELECT 
                COUNT(*) AS total
            FROM notification
                JOIN conversation USING(idconversation)
                JOIN image ON image.idimage = conversation.idowner
                JOIN category USING(idcategory)
                JOIN project USING(idproject)
            WHERE viewed = false 
                AND notification.user = '$user'
                AND project.idproject = '$idproject'
                AND conversation.owner = 'Image'
		";
		$result1 = DL::oneOf('Notification', $query);

		$query = "
            SELECT
                COUNT(*) AS total
            FROM notification
                JOIN conversation USING(idconversation)
                JOIN history ON history.idhistory = conversation.idowner
                JOIN image USING(idimage)
                JOIN category USING(idcategory)
                JOIN project USING(idproject)
            WHERE viewed = false
                AND notification.user = '$user'
                AND project.idproject = '$idproject'
                AND conversation.owner = 'History'
		";
        $result2 = DL::oneOf('Notification', $query);

		return $result1->others['total'] + $result2->others['total'];
	}

    /**
     * @remote
     * @return Notification[]
     */
    public static function notifications()
    {
        $user = (isset($_SESSION['iduser'])) ? self::USER : self::ROOT;

        $query = "
			SELECT
				notification.*,
				conversation.affair,
				conversation.idconversation,
				conversation.idowner,
				conversation.owner
			FROM notification
				JOIN  conversation USING(idconversation)
			WHERE notification.user = '$user'
			ORDER BY created DESC
        ";
        
        $notifications = DL::arrayOf('Notification', $query);
        foreach	($notifications as $notification){

            $prototype = null;
            if( $notification->others['owner'] == "Image" ){
                $prototype = DL::oneOf('Image',"
					SELECT 
						#COLUMNS
					FROM image
					WHERE idimage =". $notification->others['idowner']
                );

                $notification->others["guid"] = $prototype->guid;
            } else {
                $prototype = DL::oneOf('Image',"
					SELECT 
						image.*
					FROM image
						JOIN history USING(idimage)
					WHERE history.idhistory = ". $notification->others['idowner']
                );

                $history = DL::oneoF('History', "
					SELECT
						#COLUMNS
					FROM history
					WHERE idhistory = ". $notification->others['idowner']
                );

                $notification->others["guid"] = $history->guid;
            }

            $project = DL::oneOf('Project',"
				SELECT
					#COLUMNS
				FROM project
					JOIN category USING(idproject)
					JOIN image    USING(idcategory)
				WHERE image.idimage = ". $prototype->idimage
            );


            $notification->others["project"] = $project->name;
            $notification->others["idowner"] = $notification->others['idowner'];
            $notification->others["owner"] = $notification->others['owner'];
            $notification->others["affair"] = $notification->others['affair'];
            $notification->others["prototype"] = $prototype;
        }

        return $notifications;
    }

    /**
     * @remote
     * @param number $idproject
     * @return Notification[]
     */
    public static function notificationsByProject($idproject)
    {
        $user = (isset($_SESSION['iduser'])) ? self::USER : self::ROOT;

        $query = "
			SELECT
                notification.*,
                conversation.affair,
                conversation.idconversation,
                conversation.idowner,
                conversation.owner
            FROM project
                JOIN category USING(idproject)
                JOIN image USING(idcategory)
                JOIN conversation ON image.idimage = conversation.idowner
                JOIN notification USING (idconversation)
            WHERE project.idproject = '$idproject'
                AND notification.user = '$user'
                AND conversation.owner = 'Image'
		";
        $notificationsImage = DL::arrayOf('Notification', $query);

        $query = "
            SELECT
                notification.*,
                conversation.affair,
                conversation.idconversation,
                conversation.idowner,
                conversation.owner
            FROM project
                JOIN category USING(idproject)
                LEFT JOIN image USING(idcategory)
                LEFT JOIN history USING (idimage)
                JOIN conversation ON history.idhistory = conversation.idowner
                JOIN notification USING (idconversation)
            WHERE project.idproject = '$idproject'
                AND notification.user = '$user'
                AND conversation.owner = 'History'
        ";

        $notificationsHistory = DL::arrayOf('Notification', $query);

        $notifications = [];

        foreach( $notificationsImage as $value ){
            array_push($notifications, $value );
        }

        foreach( $notificationsHistory as $value ){
            array_push($notifications, $value );
        }

        foreach	($notifications as $notification){

            $prototype = null;
            if( $notification->others['owner'] == "Image" ){
                $prototype = DL::oneOf('Image',"
					SELECT 
						#COLUMNS
					FROM image
					WHERE idimage =". $notification->others['idowner']
                );

                $notification->others["guid"] = $prototype->guid;
            } else {
                $prototype = DL::oneOf('Image',"
					SELECT 
						image.*
					FROM image
						JOIN history USING(idimage)
					WHERE history.idhistory = ". $notification->others['idowner']
                );

                $history = DL::oneoF('History', "
					SELECT
						#COLUMNS
					FROM history
					WHERE idhistory = ". $notification->others['idowner']
                );

                $notification->others["guid"] = $history->guid;
            }

            $project = DL::oneOf('Project',"
				SELECT
					#COLUMNS
				FROM project
					JOIN category USING(idproject)
					JOIN image    USING(idcategory)
				WHERE image.idimage = ". $prototype->idimage
            );

            $notification->others["project"] = $project->name;
            $notification->others["idowner"] = $notification->others['idowner'];
            $notification->others["owner"] = $notification->others['owner'];
            $notification->others["affair"] = $notification->others['affair'];
            $notification->others["prototype"] = $prototype;
        }

        return $notifications;
    }

	/**
	 * @override
	 * @return boolean
	 */
	public function onInserting()
	{
		$this->created = DL::dateTime();
		return true;
	}

}