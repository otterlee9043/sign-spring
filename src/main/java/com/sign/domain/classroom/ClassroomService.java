package com.sign.domain.classroom;

import com.sign.domain.member.LoginMember;
import com.sign.domain.member.Member;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ClassroomService {

    Optional<Classroom> findRoomByRoomCode(String roomCode);

    List<Classroom> findRoomByRoomName(String roomName);

    Set<Classroom> findJoiningRooms(Member member);


    List<Classroom> findHostingRooms(Member host);

    Classroom createRoom(ClassroomCreateForm classroom, @AuthenticationPrincipal LoginMember loginMember);

    Classroom joinRoom(Member member, String roomCode);

    void deleteRoom(Classroom room);

}